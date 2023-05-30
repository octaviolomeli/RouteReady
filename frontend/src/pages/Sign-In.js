import '../css/forms.css';
import Form from '../Form';

function SignIn() {
  return (
    <>
      <Form header="Sign In to" action_page="/sign-in" submit_text="Sign In" side_header="New Here?" side_paragraph="Sign up to start monitoring bus stops and stations" func="/sign-up" op="Sign Up" />
    </>
  );
}

export default SignIn;