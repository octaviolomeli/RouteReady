function add(type, email, JSONData) {
    const entry_selected = document.getElementById(type+"_row").value;
    const direction = document.getElementById(type+"_directions").value;
    const stopId = document.getElementById(type+"_stops").value.split("|")[0];
    const stopName = document.getElementById(type+"_stops").value.split("|")[1];

    if (type === 'bus') {
        const busLine = document.getElementById("bus_lines").value;
        const minutes = document.getElementById("bus_walk").value;
        if (checkBusValidity(JSONData, busLine, direction, stopId)) {
            bus_predict(stopId)
            .then(jsonData => {
                const res = bus_arrivals(jsonData, busLine);
                const html_arrivals = res[1];
                const arrival_times = res[0];
                const possibleHtml = isItPossible(arrival_times, minutes);
                update_entry(stopId, type, busLine, direction, stopName, html_arrivals, possibleHtml, minutes, entry_selected, email);
                let row = document.getElementById(entry_selected);
                var min_walk_html = `<select id='${entry_selected}_minWalk' defaultValue='${minutes}'>`;
                for (var i=1; i<=30; i++) {
                    min_walk_html = min_walk_html + '<option value="'+i+'">'+i+'</option>';
                }
                min_walk_html += "</select>";
                for (var k = 0 ; k < row.children.length - 1; k++){
                    row.children[k].innerHTML = [stopId, type, busLine, direction, stopName, html_arrivals, possibleHtml, min_walk_html][k];
                }
            });
        }
    } else {
        if (checkBartValidity(JSONData, stopId, direction)) {
            BART_predict(stopId, direction)
            .then(jsonData => {
                const res = bart_arrivals(jsonData);
                const html_arrivals = res[0];
                const html_lines = res[1];
                update_entry(stopId, type, html_lines, direction.split("_")[0], stopName, html_arrivals, "N/A with BART", "0", entry_selected, email);
                let row = document.getElementById(entry_selected);
                for (var k = 0 ; k < row.children.length - 1; k++){
                    row.children[k].innerHTML = [stopId, type, html_lines, direction.split("_")[0], stopName, html_arrivals, "N/A with BART", "0"][k];
                }
            });
        }
    }
}


// recalculates the arrival time and possible columns for a row
function refresh_entry(row_id){
    var row = document.getElementById(row_id);
    var key_id = row.children[0].textContent;

    // update row html based off type
    if (row.children[1].textContent === "bus"){
        bus_predict(key_id)
        .then(jsondata => {
            const res = bus_arrivals(jsondata, row.children[2].textContent);
            const html_arrivals = res[1];
            const arrival_times = res[0];
            const possible = isItPossible(arrival_times, row.children[7].children[0].options[row.children[7].children[0].selectedIndex].value);
            row.children[6].innerHTML = possible;
            row.children[5].innerHTML = html_arrivals;
            // update database entry column
            update_entry(key_id, 
                row.children[1].textContent, 
                row.children[2].textContent, 
                row.children[3].textContent, 
                row.children[4].textContent,
                html_arrivals,
                possible,
                row.children[7].innerHTML,
                row_id);
        });
    }
    else {
        BART_predict(key_id, row.children[3].textContent.substring(0, 1))
        .then(jsondata => {
            const res = bart_arrivals(jsondata);
            const html_lines = res[1]
            const html_arrivals = res[0];

            row.children[2].innerHTML = html_lines;
            row.children[5].innerHTML = html_arrivals;
            // update database entry column
            update_entry(key_id,
                row.children[1].textContent,
                html_lines,
                row.children[3].textContent,
                row.children[4].textContent,
                html_arrivals,
                "N/A with BART",
                "0",
                row_id);
        });
    }
}


function checkBusValidity(busJSON, busLine, direction, stopId) {
    for (const entry of busJSON[busLine]) {
        if (entry['Direction'] === direction && entry['StopId'] === stopId) {
            return true;
        }
    }
    return false;
}

function checkBartValidity(bartJSON, station, direction) {
    return bartJSON[station][direction].length !== 0;
}

async function bus_predict(stopId){
    let url = "http://api.511.org/transit/StopMonitoring?api_key=[redacted]&agency=AC&stopcode="+stopId+"&format=JSON";
    const response = await fetch(url);
    return await response.json();
}

async function BART_predict(station, direction){
    let url = `http://api.bart.gov/api/etd.aspx?cmd=etd&orig=${station}&key=[redacted]&dir=${direction.substring(0,1)}&json=y`;
    const response = await fetch(url);
    return await response.json();
} 

// return arrival times and arrival times in HTML form. This function is for bus types
function bus_arrivals(jsondata, line){
    var arrival_times = ["N/A"];
    var reduced = jsondata['ServiceDelivery']['StopMonitoringDelivery']['MonitoredStopVisit'];
    var timeNow = Date.parse(jsondata['ServiceDelivery']['ResponseTimestamp']);
    // If reduced.length == 0 then there are no predictions
    if (reduced.length !== 0){
        // loop through the predictions for the stop and only save the info for predictions regarding the bus the user selected
        for (var hi = 0; hi < reduced.length; hi++)
        {
            if (reduced[hi]['MonitoredVehicleJourney']['LineRef'] === line && reduced[hi]['MonitoredVehicleJourney']['MonitoredCall']['ExpectedArrivalTime'] !== null){
                arrival_times.push(Math.floor(((Date.parse(reduced[hi]['MonitoredVehicleJourney']['MonitoredCall']['ExpectedArrivalTime']) - timeNow) / 60000)));
                const index = arrival_times.indexOf("N/A");
                if (index > -1) {
                    arrival_times.splice(index, 1); 
                }
            }    
        }
    }
    // convert arrival_times into html to insert into monitor
    var html_arrivals = "";
    if (arrival_times[0] !== "N/A"){
        for (var wee=0; wee < arrival_times.length; wee++) {
            html_arrivals += arrival_times[wee] + " minutes<br>";
        }
        html_arrivals = html_arrivals.substring(0, html_arrivals.length - 4);
    }
    else { 
        html_arrivals = arrival_times[0];
    }
    return [arrival_times, html_arrivals];
}

// takes in a list of arrival times and returns HTML string
function isItPossible(arrival_times, walk_time){
    if (arrival_times[0] === "N/A") {
        return "N/A<br>";
    }
    var result = "";
    var mins_prepare = document.getElementById("minutes_ready").value;
    if (document.getElementById("prepared").checked) {
        mins_prepare = 0;
    }
    // Loop through each arrival time
    for (var i = 0; i < arrival_times.length; i++)
    {
        if ((arrival_times[i] - walk_time - mins_prepare) >= 0)
        {
            result += `Yes. Extra ${arrival_times[i] - walk_time - mins_prepare}<br>`;
        }
        else if ((arrival_times[i] - walk_time*.75 - mins_prepare) >= 0)
        {
            result += "Yes. Walk +25%<br>";
        }
        else if ((arrival_times[i] - walk_time - mins_prepare*.75) >= 0)
        {
            result += "Yes. Ready +25%<br>";
        }
        else if (((arrival_times[i] - walk_time*.75 - mins_prepare) < 0) && ((arrival_times[i] - walk_time - mins_prepare*.75) < 0))
        {
            result += "No time<br>";
        }
    }
    return result.substring(0, result.length - 4); // to remove the last unneccessary <br>
}

function update_entry(id, type, line, direction, stop_station, arrival, possible, min_walk, entry_selected, email){    
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8888/update_user", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            entry_name: entry_selected,
            user_email: email,
            uid: id,
            utype: type,
            uline: line,
            udirection: direction,
            ustop_station: stop_station,
            uarrival: arrival,
            upossible: possible,
            umin: min_walk
    }));
}

// Delete a row from the monitor table
function delete_entry(row_id, email){
    const row = document.getElementById(row_id);
    // loop through the row's children, <td>, and set the text as " ", -1 because don't wanna remove the 'Actions' column
    for (var k=0; k < row.children.length - 1; k++){
        row.children[k].textContent = "";
    }
    // go to database and update the entry column
    var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8888/update_user", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            entry_name: row_id,
            user_email: email,
            uid: "",
            utype: "",
            uline: "",
            udirection: "",
            ustop_station: "",
            uarrival: "",
            upossible: "",
            umin: "10"
        }));
}

// return trains(line column) in HTML and arrival times HTML. This function is for BART types
function bart_arrivals(jsondata) {
    var arrival_times = ["N/A"];
    var lines_json = jsondata['root']['station'][0]['etd']; // shows multiple lines
    var lines = [];
    // if length = 0, then no predictions
    if (lines_json.length !== 0){
        arrival_times.splice(arrival_times.indexOf("N/A"), 1); 
        for (var i=0;i<lines_json.length;i++) // loop through lines at this station
        {
            lines.push(lines_json[i]['destination']);
            arrival_times.push([]);
            for (var j=0;j<lines_json[i]['estimate'].length;j++){ // loop through the predictions for each line
                arrival_times[i].push(lines_json[i]['estimate'][j]['minutes']);  
            }
        }
    }

    // convert arrival_times into html to insert into monitor
    var html_arrivals = "";
    var html_lines = "";
    // if length = 0 then no arrival times
    if (arrival_times.length !== 0){
        // loop through lines
        for (var l=0; l<lines.length;l++){
            html_lines += lines[l] + "<br>";
            // loop through prediction for each line
            for (var p=0; p<arrival_times[l].length;p++)
            {
                html_arrivals += arrival_times[l][p] + ", ";
            }
            html_arrivals = html_arrivals.substring(0, html_arrivals.length - 2) + "<br>"; // remove last ", "
        }
        html_arrivals = html_arrivals.substring(0, html_arrivals.length - 4); // remove last "<br>"
        html_lines = html_lines.substring(0, html_lines.length - 4); // remove last "<br>"
    }
    else {
        html_arrivals = "N/A";
        html_lines = "N/A";
    }
    return [html_arrivals, html_lines];
}

export { add, delete_entry, refresh_entry };
