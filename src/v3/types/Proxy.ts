type ProxyAuth = {
    username: string;
    password: string;
}

type CustomProxy = {
    protocol: string;
    host: string;
    port: number;
    auth: ProxyAuth;
}

export { ProxyAuth, CustomProxy }
