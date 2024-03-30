import { prisma } from "../../../prisma";
import RunTable from "@/components/RunTable/RunTable";

async function getUserRuns() {
    const res = prisma.run.findMany({
        include: {
            summaries: true,
            tags: true
        }
    })

    if (!res) {
        throw new Error('Failed to fetch data')
    }
    console.log(res)

    return res
}
const testSummary = [
        {
            "id": 2672,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "steps",
            "summary": "total",
            "source": "com.nike.running.ios.coremotion",
            "appId": "com.nike.sport.running.ios",
            "value": 3278
        },
        {
            "id": 2673,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "distance",
            "summary": "total",
            "source": "com.nike.running.ios.coremotion",
            "appId": "com.nike.sport.running.ios",
            "value": 3.251559999999766
        },
        {
            "id": 2674,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "descent",
            "summary": "total",
            "source": "com.nike.running.ios.coremotion",
            "appId": "com.nike.sport.running.ios",
            "value": 30.94680786132812
        },
        {
            "id": 2675,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "nikefuel",
            "summary": "mean",
            "source": "com.nike.nikefuelengine.1.0-A5.0",
            "appId": "com.nike.sport.running.ios",
            "value": 35.20082002505485
        },
        {
            "id": 2676,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "calories",
            "summary": "total",
            "source": "com.nike.running.ios.calculatedcalories",
            "appId": "com.nike.sport.running.ios",
            "value": 352.6799999999999
        },
        {
            "id": 2677,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "nikefuel",
            "summary": "total",
            "source": "com.nike.nikefuelengine.1.0-A5.0",
            "appId": "com.nike.sport.running.ios",
            "value": 831.849938463085
        },
        {
            "id": 2678,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "ascent",
            "summary": "total",
            "source": "com.nike.running.ios.coremotion",
            "appId": "com.nike.sport.running.ios",
            "value": 43.74618530273438
        },
        {
            "id": 2679,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "pace",
            "summary": "mean",
            "source": "com.nike.running.ios.coremotion",
            "appId": "com.nike.sport.running.ios",
            "value": 7.267757630184189
        },
        {
            "id": 2680,
            "runId": "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
            "metricType": "speed",
            "summary": "mean",
            "source": "com.nike.running.ios.coremotion",
            "appId": "com.nike.sport.running.ios",
            "value": 8.255641293101213
        }
]
const test = {
    activeDurationMs: 1417893n,
    app_id: "com.nike.sport.running.ios",
    change_tokens: [
        '6aa85928ab07579d77751cb6dbf5b4bdaf8e689c90488dec1073c73f629d5b21:1698438316781',
        '77b1560d73ca08d65f15233c25b0bd46cefca6fbb237884f07e4095499abc7c6:1698438316450',
        '20ee7499b0a7dafb7d3a05651eb1bc381e3844fc237f112d5b5b199fc7019e01:1698438315893',
        'a9e91539ff6f53e7cbb4a331e8a04cfc8713aa9e31aa934a1126e904f1c362d8:1698438262495',
        '64249b8ad6486f82cc3796a628a60df43859e710df8bf2b7fde2ca40447f850d:1698438258770',
        '94011679f269d4a2f83d5318f0364f6ff0c3a572b0ffe260837bc958091dd212:1698438239165'
    ],
    createdAt: new Date('Sat Mar 30 2024 15:53:38 GMT-0400 (Eastern Daylight Time)'),
    deleteIndicator: false,
    endEpoch: new Date('Fri Oct 27 2023 16:23:57 GMT-0400 (Eastern Daylight Time)'),
    id: "29d3c4c5-204c-44c2-bbad-73f6ba7e2f6e",
    nikeLastModified: new Date('Fri Oct 27 2023 16:25:16 GMT-0400 (Eastern Daylight Time)'),
    session: false,
    sources: [
        'com.nike.running.ios.calculatedcalories',
        'com.nike.pacecalculator.v1',
        'com.nike.activityCapability',
        'com.nike.running.ios.corelocation',
        'com.nike.running.ios.coremotion',
        'com.nike.nikefuelengine.1.0-A5.0'
    ],
    startEpoch: new Date('Fri Oct 27 2023 16:00:18 GMT-0400 (Eastern Daylight Time)'),
    summaries: testSummary, // Note: The summaries array is indicated to contain objects, but their structure isn't provided.
    tagId: "ff7a627c-1fa6-4d08-bc67-e34980741184",
    tags: {
        id: 'ff7a627c-1fa6-4d08-bc67-e34980741184',
        name: 'Friday Afternoon Run',
        goalType: 'duration',
        originalActivityId: '85482E9F-E29E-4785-845B-98E9F58D4A38',
        recordingAppVersion: '7.29.0',
        // More properties as indicated by "…" were not provided in detail.
    },
    updatedAt: new Date('Sat Mar 30 2024 15:53:38 GMT-0400 (Eastern Daylight Time)')
}


const UserRuns = async () => {
    const userRuns = await getUserRuns()

    return (
        <div>
           <RunTable runs={[test]} />
        </div>
    )
}

export default UserRuns;