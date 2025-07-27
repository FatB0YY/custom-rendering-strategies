interface RedirectErrorArgs {
  redirect: string;
}

export class RedirectError extends Error {
  redirect: string;

  constructor(details: RedirectErrorArgs) {
    super("Redirect error");
    const { redirect } = details;
    this.redirect = redirect;
  }
}

export class NotFoundError extends Error {
  notFound = true;

  constructor() {
    super("Not found error");
  }
}

export function pause(duration: number = 5000) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
