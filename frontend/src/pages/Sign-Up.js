import '../css/forms.css';
import Form from '../Form';

function SignUp() {
  return (
    <>
    <Form header="Sign Up for" action_page="/sign-up" submit_text="Sign Up" side_header="Already have an account?" side_paragraph="Sign in to access your monitor." func="/sign-in" op="Sign In" />
    </>
  );
}

export default SignUp;