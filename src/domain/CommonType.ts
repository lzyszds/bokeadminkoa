export interface WeatherDataType {
    "province": string,
    "city": string,
    "adcode": string,
    "weather": string,
    "temperature": string,
    "winddirection": string,
    "windpower": string,
    "humidity": string,
    "reporttime": string,
    "temperature_float": string,
    "humidity_float": string
}

export interface WeatherDataTypeResponse {
    "status": string,
    "count": string,
    "info": string,
    "infocode": string,
    "lives": [
        {
            "province": string,
            "city": string,
            "adcode": string,
            "weather": string,
            "temperature": string,
            "winddirection": string,
            "windpower": string,
            "humidity": string,
            "reporttime": string,
            "temperature_float": string,
            "humidity_float": string
        }
    ]
}

export interface SystemConfigType {
    id: number,
    config_key: string,
    config_value: string,
    config_desc: string
}