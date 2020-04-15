export interface IAuthTokenVerifier {

    verify(token: string): Promise<void>;

}