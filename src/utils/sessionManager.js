const MongoStore = require("connect-mongo");

class SessionManager {
  constructor(store) {
    this.store = store;
  }

  async getActiveSessions() {
    return new Promise((resolve, reject) => {
      this.store.all((error, sessions) => {
        if (error) reject(error);
        resolve(sessions);
      });
    });
  }

  async revokeSession(sessionId) {
    return new Promise((resolve, reject) => {
      this.store.destroy(sessionId, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }

  async revokeUserSessions(userId) {
    const sessions = await this.getActiveSessions();
    const userSessions = sessions.filter(
      (session) => session.user && session.user.id === userId
    );

    await Promise.all(
      userSessions.map((session) => this.revokeSession(session.id))
    );
  }
}

module.exports = SessionManager;
