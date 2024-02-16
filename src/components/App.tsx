import React, {useMemo, useState} from 'react';
import '../App.css';
import Dropzone from './Dropzone';
import {CircularProgress, Tab, Tabs} from '@mui/material';
import Instructions from "./Instructions";
import Combobox from './Combobox';
import {BoostsTab, DamageDoneTab, DamageTakenTab, EventsTab, GroupDamageTab, TabsEnum} from './Tabs';
import {getFightDuration} from "../utils/utils";
import {Fight} from "../models/Fight";

function App() {
    const [worker] = useState<Worker>(() => {
        const worker = new Worker(new URL("FileParserWorker.ts", import.meta.url));

        worker.onmessage = (event) => {
            const {type, progress, parseResultMessage, item} = event.data;
            if (type === 'progress') {
                setParsingProgress(progress);
            } else if (type === 'parseResult') {
                setFightNames(parseResultMessage.fightNames);
                setSelectedLogs(parseResultMessage.firstResult);
                setParseInProgress(false);
                setFightDuration(getFightDuration(parseResultMessage.firstResult));
            } else if (type === 'item') {
                setSelectedLogs(item);
                setFightDuration(getFightDuration(item));
            }
        };

        return worker;
    });

    const [fightNames, setFightNames] = useState<string[] | null>(null);
    const [selectedLogs, setSelectedLogs] = useState<Fight | null>(null);
    const [selectedTab, setSelectedTab] = useState<TabsEnum>(TabsEnum.DAMAGE_DONE);
    const [fightDuration, setFightDuration] = useState<string>("");

    const [parseInProgress, setParseInProgress] = useState<boolean>(false);
    const [parsingProgress, setParsingProgress] = useState<number>(0);

    const handleParse = async (fileContent: string) => {
        setParseInProgress(true);
        worker.postMessage({type: 'parse', fileContent});
    };


    const handleDropdownChange = (index: number) => {
        worker.postMessage({type: 'getItem', index});
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: TabsEnum) => {
        setSelectedTab(newValue);
    };

    interface Option {
        label: string;
        value: number;
    }

    const options: Option[] = useMemo(() => {
        if (fightNames) {
            return fightNames.map((fightName, index) => ({
                label: fightName,
                value: index,
            }));
        } else {
            return [];
        }
    }, [fightNames]);


    if (parseInProgress) {
        return (
            <div className="App">
                <header className="App-body">
                    <div className="loading-indicator-container">
                        <div className="loading-content">
                            <p>Parsing logs...</p>
                            <CircularProgress/>
                            <p>{Math.floor(parsingProgress)}%</p>
                        </div>
                    </div>
                </header>
            </div>
        );
    }

    if (!selectedLogs) {
        return (
            <div className="App">
                <header className="App-body">
                    <Instructions/>
                    <Dropzone onParse={handleParse}/>
                </header>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="App-body">
                <label>{selectedLogs.name}</label>
                <Combobox<Option>
                    id="monster-select"
                    items={options}
                    placeholder="Select a fight"
                    onSelectedItemChange={(item) => {
                        if (item) {
                            handleDropdownChange(item!.value)
                        }
                    }}
                />

                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth" // Maybe should be scrollable for mobile as we add more?
                >
                    {Object.values(TabsEnum).map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            value={tab}
                            style={{
                                color: selectedTab === tab ? 'lightblue' : 'white',
                            }}
                        />
                    ))}
                </Tabs>

                <div>
                    <p>Fight Duration: {fightDuration}</p>
                </div>
                {selectedTab === TabsEnum.DAMAGE_DONE && <DamageDoneTab selectedLogs={selectedLogs}/>}
                {selectedTab === TabsEnum.DAMAGE_TAKEN && <DamageTakenTab selectedLogs={selectedLogs}/>}
                {selectedTab === TabsEnum.BOOSTS && <BoostsTab selectedLogs={selectedLogs}/>}
                {selectedTab === TabsEnum.GROUP_DAMAGE && <GroupDamageTab selectedLogs={selectedLogs}/>}
                {selectedTab === TabsEnum.EVENTS && <EventsTab selectedLogs={selectedLogs}/>}
            </header>
        </div>
    );
}

export default App;
