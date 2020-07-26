declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string
    PORT: string
    SALT_ROUNDS: string
    TOKEN_SECRET: string
  }
}
