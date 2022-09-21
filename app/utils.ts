
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email: string): string | undefined {
    if (email.length === 0) {
        return "Please fill out this field"
    }

    if (email.toLowerCase().match(emailRegex) === null) {
        return "Email is not valid";
    }
}

export function validatePassword(password: string): string | undefined {
    if (password.length === 0) {
        return "Please fill out this field"
    }

    if (password.length <= 6) {
        return "Password is too short";
    }
}