export interface Manifest {
    name:string;
    short_name: string;
    description: string;
    display: "browser"|"minimal-ui"|"standalone"|"fullscreen";
    scope: string;
    start_url: string;
    splash_pages: any;
    icons: Icon[];
}

export interface Icon {
    src: string;
    sizes: string;
    type: string;
}