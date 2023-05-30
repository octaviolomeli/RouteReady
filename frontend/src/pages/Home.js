import '../index.css';

function Home() {
  return (
    <div className="App">
        <span className="font-increase"><span>Route</span><span className="green">Ready</span></span>
        <header>
            <a href="/sign-up" className="redirect-buttons">Sign Up</a>
            <a href="/sign-in" className="redirect-buttons">Sign In</a>
        </header>
        <img src="../img/index-cover.png" width="100%" height="auto" id="photo" alt="Bus and subway." />
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <span id="subheader">Catch buses on time in four steps:</span>
                    <ol id="steps">
                        <li>Set time it takes you to prepare to go out</li>
                        <li>Select a bus and bus stop or BART station</li>
                        <li>Set time it takes you to walk there</li>
                        <li>Add to your list of monitored stops</li>
                    </ol>
                    <br/>
                    <h5><a href="/sign-up">Make</a> your free account today.</h5>
                    <hr/>
                    <h4>Note:</h4>
                    <ul id="disclaimer-text">
                        <li><b>Route</b><span className="green">Ready</span> only works for AC Transit buses and Bay Area Rapid Transit stations</li>
                        <li>The data is provided by <a href="https://511.org/">511.org</a></li>
                    </ul>
                </div>
                <div className="col-md-6">
                    <img src="../img/monitor-photo.png" width="100%" height="auto" id="photo2" alt="Monitor page" />
                </div>
            </div>
        </div>
    </div>
  );
}

export default Home;