import '../css/monitor.css';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { add, delete_entry, refresh_entry } from '../script.js';

var busJSON;
var bartJSON;

(async () => {
    try {
        fetch('http://localhost:8888/data/bus')
        .then(response => response.json())
        .then(JSONData => busJSON = JSONData);

        fetch('http://localhost:8888/data/bart')
        .then(response => response.json())
        .then(JSONData => bartJSON = JSONData);
    } catch (error) {
        console.log(error);
    }
})();


function Monitor() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [userData, setUserData] = useState({});
    const [validCredentials, setCredentials] = useState(false);
    // variables to determine what to show
    const [busLine, setBusLine] = useState('6');
    const [busDirection, setBusDirection] = useState('To Downtown Berkeley');
    useEffect( () => { 
        async function fetchUserData() {
            try {
                fetch('http://localhost:8888/user/'+searchParams.get('email')+'/'+encodeURIComponent(searchParams.get('password')))
                .then(response => response.json())
                .then(data => {
                    if (data.valid === 'true') {
                        setCredentials(true);
                        setUserData(data.data);
                    } else {
                        setCredentials(false);
                        navigate({ pathname: '/sign-in'});
                    }
                })
            } catch (err) {
                console.log(err);
            }
        }
        fetchUserData();
    }, [navigate, searchParams]);

    useEffect(() => {
        setBusDirection(busJSON[busLine][0]['Direction']);
    }, [busLine])

    if (validCredentials) {
        return (
            <>
                <nav className="navbar navbar-expand-lg color-green">
                    <a className="navbar-brand" href="/">Route<span className="green-text">Ready</span></a>
                    <span id="nemail">{userData.email}</span>
                    <a href="/sign-in" id="sign-out">Sign Out</a>
                </nav>

                <div className="margins">
                    <span className="subheader-monitor">AC Transit</span><br/>
                    <div className="row spans">

                        <div className="col-sm-4">
                            <span>Bus Line</span><br/>
                            <select id="bus_lines" onChange={e => {
                                    setBusLine(e.target.value);
                                }}>
                                {Object.keys(busJSON).map((busLine, index) => {
                                    return <option key={index} value={busLine}>{busLine}</option>
                                })}
                            </select>
                        </div>

                        <div className="col-sm-4">
                            <span>Bus Direction</span><br/>
                            <select id="bus_directions" onChange={e => {
                                setBusDirection(e.target.value)
                            }}>
                                <option value={busJSON[busLine][0]['Direction']}>{busJSON[busLine][0]['Direction']}</option>
                                <option value={busJSON[busLine][busJSON[busLine].length - 1]['Direction']}>{busJSON[busLine][busJSON[busLine].length - 1]['Direction']}</option>
                            </select>
                        </div>
    
                        <div className="col-sm-4">
                            <span>Bus Stop</span><br/>
                            <select id="bus_stops">
                                {busJSON[busLine].map((stop, index) => {
                                    if (stop['Direction'] === busDirection) {
                                        return <option key={index} value={stop['StopId']+"|"+stop['Stop']}>{stop['Stop']}</option>
                                    }
                                    return ""
                                })}
                            </select>
                        </div>
                    </div>
                    <br/>
                    <div className="row spans">
                        <div className="col-sm-4">
                            <span>Minutes to walk there</span><br/>
                            <select id="bus_walk">
                                {[...Array(20).keys()].map(number => {
                                    return <option key={number} value={number + 1}>{number + 1}</option>
                                })}
                            </select>
                        </div>

                        <div className="col-sm-4">
                            <span>Entry row to change</span><br/>
                            <select id="bus_row">
                                {[...Array(7).keys()].map(number => {
                                    return <option key={number} value={"entry" + number}>{"Row " + (number + 1)}</option>
                                })}
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <br/>
                            <button className="add-button" onClick={() =>  {
                                add('bus', userData.email, busJSON);
                            }}>Add</button>
                        </div>
                        <div className="col-sm-2"></div>
                    </div>
                    <br/>
                    
                    {/* BART */}
                    <br/>
                    <span className="subheader-monitor">Bay Area Rapid Transit</span><br/>
                    <div className="row spans">
                        <div className="col-sm-4">
                            <span>Stations</span><br/>
                            <select id="bart_stops">
                            {Object.keys(bartJSON).map((stationCode, index) => {
                                return <option key={index} value={stationCode + '|' + bartJSON[stationCode]['Name']}>{bartJSON[stationCode]['Name']}</option>
                            })}
                            </select>
                        </div>

                        <div className="col-sm-3">
                            <span>BART Directions</span><br/>
                            <select id="bart_directions">
                                <option value="north_routes">North</option>
                                <option value="south_routes">South</option>
                            </select>
                        </div>

                        <div className="col-sm-3">
                            <span>Entry row to change</span><br/>
                            <select id="bart_row">
                                {[...Array(7).keys()].map(number => {
                                    return <option key={number} value={"entry" + number}>{"Row " + (number + 1)}</option>
                                })}
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <br/>
                            <button className="add-button" onClick={() => add('bart', userData.email, bartJSON)}>Add</button>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-3">
                            <h2>Monitor</h2>
                        </div>
                        <div className="col-sm-9 spacer">
                            <label htmlFor="minutes_ready">Minutes to get ready:</label>
                            <select id="minutes_ready">
                                {[...Array(20).keys()].map(number => {
                                    return <option key={number} value={number + 1}>{number + 1}</option>
                                })}
                            </select>
                            <span>
                                <label htmlFor="prepared">Already ready:</label>
                                <input type="checkbox" id="prepared" name="prepared" value="False" />
                            </span>
                        </div>
                    </div>

                    <table id="monitor">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Line</th>
                                <th>Direction</th>
                                <th>Stop/Station</th>
                                <th>Arrival</th>
                                <th>Possible</th>
                                <th>Min. to walk</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[userData.entry0, userData.entry1, userData.entry2, userData.entry3, userData.entry4, userData.entry5, userData.entry6].map((entry, index) => (
                                <tr id={"entry"+index} key={index}>
                                    <td>{entry.id}</td>
                                    <td>{entry.vehicle}</td>
                                    <td dangerouslySetInnerHTML={{__html: entry.line}}></td>
                                    <td>{entry.direction}</td> 
                                    <td>{entry.stop}</td> 
                                    <td dangerouslySetInnerHTML={{__html: entry.arrival}}></td>
                                    <td dangerouslySetInnerHTML={{__html: entry.possible}}></td>
                                    <td>
                                        <select id={`entry`+index+"_minWalk"} defaultValue={entry.min_to_walk}>
                                            {[...Array(30).keys()].map(number => { 
                                                return <option key={number} value={number + 1}>{number + 1}</option>
                                            })}
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => delete_entry('entry'+ index, userData.email)}  className="trash"><i className="fa-solid white fa-trash-can"></i></button>
                                        <button onClick={() => refresh_entry("entry" + index)} className="refresh"><i className="fa-solid white fa-arrows-rotate"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default Monitor;
