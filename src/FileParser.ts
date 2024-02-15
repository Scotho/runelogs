import {logSplitter} from "./LogSplitter";

export interface Fight {
    name: string;
    data: LogLine[];
    enemies: string[];
    loggedInPlayer: string;

    // Just for easy reference later
    firstLine: LogLine | undefined;
    lastLine: LogLine | undefined;
}

export interface BoostedLevels {
    attack: number;
    strength: number;
    defence: number;
    ranged: number;
    magic: number;
    hitpoints: number;
    prayer: number;
}

export interface LogLine {
    date: string;
    time: string;
    timezone: string;
    target?: string;
    loggedInPlayer?: string;
    logVersion?: string;
    hitsplatName?: string;
    damageAmount?: number;
    boostedLevels?: BoostedLevels;
    playerEquipment?: string;
    source?: string;
}

export const parseLogLine = (logLine: string): LogLine | null => {
    const DATE_PATTERN = '\\d{2}-\\d{2}-\\d{4}';
    const TIME_PATTERN = '\\d{2}:\\d{2}:\\d{2}\\.\\d{3}';
    const TIMEZONE_PATTERN = '\\w+';
    const ANYTHING_PATTERN = '.*';
    const ANYTHING_BUT_TAB_PATTERN = '[^\\t]*';

    const pattern = new RegExp(`^(${DATE_PATTERN}) (${TIME_PATTERN}) (${TIMEZONE_PATTERN})\t(${ANYTHING_PATTERN})`);

    let match = logLine.match(pattern);

    if (!match) {
        console.error('Invalid log line format:', logLine);
        return null;
    }
    const [, date, time, timezone, action] = match;


    const logVersionPattern = new RegExp(`Log Version (${ANYTHING_PATTERN})`)
    match = action.match(logVersionPattern);
    if (match) {
        const [, logVersion] = match;
        console.log(`Log Version ${logVersion}`);
        return {
            date,
            time,
            timezone,
            logVersion
        };
    }
    const loggedInPlayerPattern = new RegExp(`Logged in player is (${ANYTHING_PATTERN})`)
    match = action.match(loggedInPlayerPattern);
    if (match) {
        const [, loggedInPlayer] = match;
        return {
            date,
            time,
            timezone,
            loggedInPlayer
        };
    }

    const boostedLevelsPattern = new RegExp(`Boosted levels are \\[(\\d+), (\\d+), (\\d+), (\\d+), (\\d+), (\\d+), (\\d+)\\]`);
    match = action.match(boostedLevelsPattern);
    if (match) {
        const [, attack, strength, defence, ranged, magic, hitpoints, prayer] = match.map(Number);

        const boostedLevels: BoostedLevels = {
            attack,
            strength,
            defence,
            ranged,
            magic,
            hitpoints,
            prayer
        };

        return {
            date,
            time,
            timezone,
            boostedLevels
        };
    }

    const playerEquipmentPattern = new RegExp(`Player equipment is (${ANYTHING_PATTERN})`)
    match = action.match(playerEquipmentPattern);
    if (match) {
        const [, playerEquipment] = match;
        return {
            date,
            time,
            timezone,
            playerEquipment
        };
    }

    const diesPattern = new RegExp(`^(${ANYTHING_PATTERN}) dies`)
    match = action.match(diesPattern);
    if (match) {
        const [, target] = match;
        return {
            date,
            time,
            timezone,
            target,
            hitsplatName: "DEATH",
        };
    }

    const changedTargetPattern = new RegExp(`^(${ANYTHING_PATTERN}) changes target to (${ANYTHING_PATTERN})`)
    match = action.match(changedTargetPattern);
    if (match) {
        const [, source, target] = match;
        return {
            date,
            time,
            timezone,
            source,
            target,
            hitsplatName: "CHANGE_TARGET",
        };
    }


    const defaultPattern = new RegExp(`^(${ANYTHING_BUT_TAB_PATTERN})\t(${ANYTHING_BUT_TAB_PATTERN})\t(${ANYTHING_BUT_TAB_PATTERN})`);

    match = action.match(defaultPattern);
    if (!match) {
        console.error('Invalid log line format:', logLine);
        return null;
    }
    const [, target, hitsplatName, damageAmount] = match;

    return {
        date,
        time,
        timezone,
        target,
        hitsplatName,
        damageAmount: parseInt(damageAmount, 10),
    };
};

export function parseFileContent(fileContent: string, progressCallback: (progress: number) => void): Fight[] | null {
    try {
        const lines = fileContent.split('\n');
        let parsedLines = 0;
        let fightData: LogLine[] = [];

        for (const line of lines) {
            const logLine = parseLogLine(line.trim());

            if (logLine) {
                fightData.push(logLine);
            }

            parsedLines++;
            if (progressCallback && parsedLines % 200 === 0) {
                const progress = (parsedLines / lines.length) * 50;
                progressCallback(progress);
            }
        }

        let fights: Fight[] = logSplitter(fightData, progressCallback);

        console.log(fights);
        return fights;
    } catch (error) {
        console.error('Error parsing file content:', error);
        return null;
    }
}

