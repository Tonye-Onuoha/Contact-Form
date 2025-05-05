const form = document.getElementById("form");
const firstNameInput = document.getElementById("first-name");
const firstNameErrorText = document.getElementById("first-name-error-text");
const lastNameInput = document.getElementById("last-name");
const lastNameErrorText = document.getElementById("last-name-error-text");
const emailInput = document.getElementById("email-address");
const emailErrorText = document.getElementById("email-error-text");
const queryOptions = Array.from(document.querySelectorAll("input[type='radio']"));
const queryOptionsContainer = Array.from(document.querySelectorAll(".query-option"));
const queryOptionsErrorText = document.getElementById("query-error-text");
const messageInput = document.getElementById("message");
const messageErrorText = document.getElementById("message-error-text");
const checkboxInput = document.querySelector("input[type='checkbox']");
const checkboxInputErrorText = document.getElementById("consent-error-text");
const successMessage = document.getElementById("success-message-container");
// selected query-type defaults to false.
let queryIsSelected = false;

// This function determines if an input value is empty.
const inputNotEmpty = (value) => value.trim().length > 0;

// This function validates the email format.
const isValidEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9]*[\._]?[a-zA-Z0-9]*@{1}[a-zA-Z]*_?[a-zA-Z]*\.{1}com$/;
    const isValid = emailRegex.test(value);
    return isValid;
};

// This function sets the styling of the selected query-type.
const selectQueryType = (index) => {
    if (queryOptionsErrorText.style.display == "block") queryOptionsErrorText.style.display = "none";
    if (queryIsSelected) resetQueryType();
    const optionContainer = queryOptionsContainer[index];
    optionContainer.style.backgroundColor = "lightgray";
    optionContainer.style.border = "1px solid hsl(169, 82%, 27%)";
    queryIsSelected = true;
};

// This function resets the styling of the selected query-type.
const resetQueryType = () => {
    const selectedQueryType = queryOptionsContainer.find((container) => container.style.backgroundColor == "lightgray");
    selectedQueryType.style.backgroundColor = "";
    selectedQueryType.style.border = "1px solid hsl(186, 15%, 59%)";
    queryIsSelected = false;
};

// This function handles the different inputs based on certain events.
const inputHandler = (errorText, e) => {
    if (e.currentTarget.type == "text" || e.currentTarget.type == "email" || e.currentTarget.type == "textarea") {
        if (inputNotEmpty(e.currentTarget.value) && e.currentTarget.style.border == "1px solid rgb(215, 60, 60)") {
            e.currentTarget.style.border = "1px solid hsl(186, 15%, 59%)";
            errorText.style.display = "none";
        }
    }
    if (e.currentTarget.type == "checkbox" && e.currentTarget.checked && errorText.style.display == "block") {
        errorText.style.display = "none";
    }
};

// This function displays the success message to the screen if the form data is valid.
const showSuccessMessage = () => {
    successMessage.style.display = "flex";
    window.scrollTo(0, 0);
};

// This function updates the error object with the expected error messages (if any).
function handleErrorObject(errorMessage, key, errorsObject) {
    errorsObject[key] = errorMessage;
}

// This function renders error messages to the screen if the form data is invalid.
function handleErrorMessages(errorsObject) {
    if ("first-name" in errorsObject) {
        firstNameInput.style.border = "1px solid hsl(0, 66%, 54%)";
        firstNameErrorText.style.display = "block";
        firstNameErrorText.textContent = errorsObject["first-name"];
    }
    if ("last-name" in errorsObject) {
        lastNameInput.style.border = "1px solid hsl(0, 66%, 54%)";
        lastNameErrorText.style.display = "block";
        lastNameErrorText.textContent = errorsObject["last-name"];
    }
    if ("email" in errorsObject) {
        emailInput.style.border = "1px solid hsl(0, 66%, 54%)";
        emailErrorText.style.display = "block";
        emailErrorText.textContent = errorsObject["email"];
    }
    if ("query-type" in errorsObject) {
        queryOptionsErrorText.style.display = "block";
        queryOptionsErrorText.textContent = errorsObject["query-type"];
    }
    if ("message" in errorsObject) {
        messageInput.style.border = "1px solid hsl(0, 66%, 54%)";
        messageErrorText.style.display = "block";
        messageErrorText.textContent = errorsObject["message"];
    }
    if ("consent" in errorsObject) {
        checkboxInputErrorText.style.display = "block";
        checkboxInputErrorText.textContent = errorsObject["consent"];
    }
}

// This function checks the validity of the form data.
function handleInputData(key, value, errorsObject) {
    if ((key == "first-name" || key == "last-name" || key == "email" || key == "message") && !inputNotEmpty(value)) {
        handleErrorObject("This field is required", key, errorsObject);
        return;
    }
    if (key == "email" && !isValidEmail(value)) {
        handleErrorObject("Email address format is not valid", key, errorsObject);
    }
    if (key == "query-type") return;
}

// This function returns true if the form-data is valid, otherwise it returns false.
function dataIsValid(data, errorsObject) {
    Object.keys(data).forEach((key) => {
        handleInputData(key, data[key], errorsObject);
    });
    const isValid = Object.keys(errorsObject).length === 0;

    return isValid;
}

// This function handles the form submission.
const handleFormSubmit = (e) => {
    // prevent default form behaviour.
    e.preventDefault();
    // retrieve the form data.
    const formData = new FormData(e.currentTarget);
    // convert the form data entries into an object.
    const data = Object.fromEntries(formData);
    // initialize empty errors-object.
    const errorsObject = {};
    // handle checkbox error if checkbox is not checked.
    if (!checkboxInput.checked) {
        handleErrorObject("To submit this form, please consent to being contacted", "consent", errorsObject);
    }
    // handle radio-button error if none is clicked.
    if (!("query-type" in data)) handleErrorObject("Please select a query type", "query-type", errorsObject);
    // check if data is valid and return error-messages if invalid.
    if (!dataIsValid(data, errorsObject)) handleErrorMessages(errorsObject);
    // else show success-message.
    else showSuccessMessage();
};

/* Event Listeners */

firstNameInput.addEventListener("keyup", inputHandler.bind(null, firstNameErrorText));

lastNameInput.addEventListener("keyup", inputHandler.bind(null, lastNameErrorText));

emailInput.addEventListener("keyup", inputHandler.bind(null, emailErrorText));

messageInput.addEventListener("keyup", inputHandler.bind(null, messageErrorText));

checkboxInput.addEventListener("click", inputHandler.bind(null, checkboxInputErrorText));

queryOptions.forEach((option, index) => option.addEventListener("focus", selectQueryType.bind(null, index)));

form.addEventListener("submit", handleFormSubmit);
