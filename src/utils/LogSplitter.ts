import {DamageLog, LogLine, LogTypes} from "../models/LogLine";
import {DamageMaxMeHitsplats, DamageMeHitsplats} from "../HitsplatNames";
import {Fight} from "../models/Fight";
import {BoostedLevels} from "../models/BoostedLevels";
import {convertMillisToTime, convertTimeToMillis, getFightDuration} from "./utils";
import moment from 'moment';


const BOSS_NAMES = [
    "Scurrius",
    "Kree'arra",
    "Commander Zilyana",
    "General Graardor",
    "K'ril Tsutsaroth",
    "Nex",
    "Kalphite Queen",
    "Sarachnis",
    "Scorpia",
    "Abyssal Sire",
    "Kraken",
    "Dagannoth Rex",
    "Dagannoth Supreme",
    "Dagannoth Prime"
];

/**
 * If it is the logged in player that dealt/attempted the damage
 */
function playerAttemptsDamage(log: DamageLog) {
    return Object.values(DamageMeHitsplats).includes(log.hitsplatName!) ||
        Object.values(DamageMaxMeHitsplats).includes(log.hitsplatName!) ||
        log.hitsplatName === 'BLOCK_ME';
}

export function logSplitter(fightData: LogLine[], progressCallback?: (progress: number) => void): Fight[] {
    const totalLines = fightData.length;
    let parsedLines = 0;

    const fights: Fight[] = [];
    let currentFight: Fight | null = null;
    let player: string = ""; //todo support multiple players
    let lastDamage: { time: string, index: number } | null = null;
    let boostedLevels: BoostedLevels | undefined;
    let playerEquipment: string[] | undefined;
    let fightStartTime: Date;

    function endFight(lastLine: LogLine, success: boolean, nullFight: boolean = true) {
        currentFight!.lastLine = lastLine;

        currentFight!.metaData = {
            date: currentFight!.firstLine.date,
            fightLength: getFightDuration(currentFight!),
            name: currentFight!.name,
            success: success,
            time: currentFight!.firstLine.time
        }
        fights.push(currentFight!);
        if (nullFight) {
            currentFight = null;
        }
        lastDamage = null;
    }

    for (const logLine of fightData) {
        if (logLine.type === LogTypes.LOGGED_IN_PLAYER) {
            player = logLine.loggedInPlayer;
        }

        if (logLine.type === LogTypes.BOOSTED_LEVELS) {
            boostedLevels = logLine.boostedLevels;
        }

        if (logLine.type === LogTypes.PLAYER_EQUIPMENT) {
            playerEquipment = logLine.playerEquipment;
        }

        // If there's a gap of over 60 seconds end the current fight
        if (currentFight && lastDamage && convertTimeToMillis(logLine.time) - convertTimeToMillis(lastDamage.time) > 60000) {
            // eslint-disable-next-line no-loop-func
            currentFight.data = currentFight.data.filter((log, index) => index <= lastDamage!.index);
            currentFight.name += " - Incomplete";
            endFight(currentFight.data[currentFight.data.length - 1], false);
        }

        // If the current fight is null, start a new fight
        if (!currentFight && logLine.type === LogTypes.DAMAGE && playerAttemptsDamage(logLine) && logLine.target !== player) {
            fightStartTime = moment(`${logLine.date} ${logLine.time}`, 'MM-DD-YYYY HH:mm:ss.SSS').toDate();
            logLine.fightTime = convertMillisToTime(0);

            const initialData: LogLine[] = [];

            // Include current boosted levels at the beginning of the fight
            if (boostedLevels) {
                initialData.push({
                    type: LogTypes.BOOSTED_LEVELS,
                    date: logLine.date,
                    time: logLine.time,
                    timezone: logLine.timezone,
                    boostedLevels: boostedLevels,
                    fightTime: convertMillisToTime(0)
                });
            }

            // Include current player equipment at the beginning of the fight
            if (playerEquipment) {
                initialData.push({
                    type: LogTypes.PLAYER_EQUIPMENT,
                    date: logLine.date,
                    time: logLine.time,
                    timezone: logLine.timezone,
                    playerEquipment: playerEquipment,
                    fightTime: convertMillisToTime(0)
                });
            }

            // @ts-ignore
            currentFight = {
                name: logLine.target,
                enemies: [logLine.target],
                data: [
                    ...initialData,
                    logLine
                ],
                loggedInPlayer: player,
                firstLine: logLine,
                lastLine: logLine
            };
        } else if (currentFight) {
            // Rename the fight if we encounter a boss in the middle of it
            if ("target" in logLine && BOSS_NAMES.includes(logLine.target!) && currentFight.name !== logLine.target) {
                currentFight.name = logLine.target!;
            }
            // Add target to list of enemies
            if (logLine.type === LogTypes.DAMAGE && playerAttemptsDamage(logLine) && logLine.target !== player && !currentFight.enemies.includes(logLine.target!)) {
                currentFight.enemies.push(logLine.target!);
            }

            // Subtract the start time from the log's timestamp to get the relative time within the fight
            const logDate = moment(`${logLine.date} ${logLine.time}`, 'MM-DD-YYYY HH:mm:ss.SSS').toDate();
            logLine.fightTime = convertMillisToTime(logDate.getTime() - fightStartTime!.getTime());

            currentFight.data.push(logLine);
        }

        if (currentFight && logLine.type === LogTypes.DAMAGE && playerAttemptsDamage(logLine)) {
            lastDamage = {
                time: logLine.time,
                index: currentFight.data.length - 1
            };
        }

        if (logLine.type === LogTypes.DEATH && logLine.target) {
            // If the player or the fight name dies, end the current fight
            if (currentFight) {
                if (logLine.target === currentFight.name) {
                    endFight(logLine, true);
                } else if (logLine.target === currentFight.loggedInPlayer) {
                    endFight(logLine, false);
                }
            }
        }

        parsedLines++;
        if (progressCallback && parsedLines % 200 === 0) {
            const progress = 50 + (parsedLines / totalLines) * 50;
            progressCallback(progress);
        }
    }

    // If we reach the end of the logs, end the current fight
    if (currentFight) {
        endFight(currentFight.data[currentFight.data.length - 1], false, false);
    }

    const fightNameCounts: Map<string, number> = new Map(); // Map to store counts of each fight name

    const filteredFights = fights.filter((fight) => {
        // If the fight has no damage logs from the player, discard it
        const hasPlayerDamage = fight.data.some((logLine) =>
            logLine.type === LogTypes.DAMAGE && playerAttemptsDamage(logLine)
        );
        if (!hasPlayerDamage) {
            return false;
        }

        // Make fight names unique
        let count = 1;
        if (fightNameCounts.has(fight.name)) {
            count = fightNameCounts.get(fight.name)! + 1;
        }
        fightNameCounts.set(fight.name, count);
        fight.name = `${fight.name} - ${count}`;

        return true;
    });

    return filteredFights;
}
