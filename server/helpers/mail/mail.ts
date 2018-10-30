export interface Mail {
    send(to: string[], subject: string, body: string);
}