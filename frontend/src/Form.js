import React from 'react';
import { useState } from 'react';
import { createSearchParams, useNavigate} from 'react-router-dom';

const Form = (props) => {

  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setPassword] = useState("");
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();

  const submit_data = async (e) => {
    e.preventDefault();
    var data = {
      email: inputEmail,
      password: inputPassword
    }
    fetch(
      'http://localhost:8888/form/'+props.action_page, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    .then(response => response.json())
    .then(data => {
      // monitor page if successful sign in
      if (data.mode === 'sign-in' && data.msg === 'success') {
        // on the monitor page, look up the user's data using the provided email and make sure the password unhashed equals their actual password
        navigate({
          pathname: '/monitor',
          search: createSearchParams({
            email: data.data.email,
            password: data.data.password
          }).toString()
        });
      } else if (data.mode === 'sign-up' && data.msg === 'success') {
        window.location.href = "/sign-in";
      } else {
        setError(data.msg);
      }
    })
    .catch(error => console.log(error))
  }

  return (
    <div>
        <a href="/"><button className="go-home">Home Page</button></a>
        <div className="split-l margin-top">
            <h1 className="center-text">{props.header}</h1>
            <h1 className="center-text title">Route<span className="green-text">Ready</span></h1>
            <span className="red-text">{errorMessage}</span>
            <form onSubmit={submit_data}>
                <input className="input-fields" type="email" placeholder="Email" value={inputEmail} onChange={(e) => setEmail(e.target.value)} />
                <br/>
                <input className="input-fields" type="password" placeholder="Password"value={inputPassword} onChange={(e) => setPassword(e.target.value)} />
                <br/><br/>
                <button type="submit" className="form-button">{props.submit_text}</button>
            </form>
        </div>
        <div className="split-r green-gradient center">
            <h3 className="subheader">{props.side_header}</h3>
            <p>{props.side_paragraph}</p>
            <a href={props.func} className="form-button">{props.op}</a>
        </div>
    </div>
  )
}

export default Form