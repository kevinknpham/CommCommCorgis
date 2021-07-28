class Logger {
  #consoleMethods;
  #fileMethods;
  #fileWriter;

  constructor(consoleMethods, fileMethods) {
    if (Logger.instance instanceof Logger) {
      return Logger.instance;
    }

    this.#consoleMethods = consoleMethods;
    this.#fileMethods = fileMethods;

    Logger.instance = this;
  }

  debug(stmt) {
    if (this.#consoleMethods.debug) {
      console.log(stmt);
    }

    if (this.#fileMethods.debug) {
    }
  }

  info(stmt) {
    if (this.#consoleMethods.debug) {
      console.log(stmt);
    }

    if (this.#fileMethods.debug) {
    }
  }

  error(stmt) {
    if (this.#consoleMethods.debug) {
      console.log(stmt);
    }

    if (this.#fileMethods.debug) {
    }
  }
}

module.exports = { Logger };
