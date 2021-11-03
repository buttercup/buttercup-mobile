interface Attribution {
    name: string;
    description: string;
    links?: Array<{
        description: string;
        url: string;
    }>;
}

export const ATTRIBUTIONS: Array<Attribution> = [
    {
        name: "Icons",
        description: "Some icons made by Freepik from Flaticon.",
        links: [
            {
                description: "Freepik",
                url: "https://www.freepik.com"
            },
            {
                description: "Flaticon",
                url: "https://www.flaticon.com"
            }
        ]
    }
];
