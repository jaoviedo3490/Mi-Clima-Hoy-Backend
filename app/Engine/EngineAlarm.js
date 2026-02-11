
import Parser from 'rss-parser';
import ServicesDataSet from "../JsonData/ServicesDataSet.json";
import ServiceStrucData from "../JsonData/ServiceStructData.json"

const EngineAlarm = async (locate, date) => {

    try {
        var json_alerts_return = {}
        switch (locate) {
            case "Colombia":
                const parserTest = new Parser({
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                        }
                    }
                })
                //console.log(ServicesDataSet.AlarmPublicServices.Countries[locate][0].url)
                const feed = await parserTest.parseURL(ServicesDataSet.AlarmPublicServices.Countries[locate][0].url);
                //console.log(ServicesDataSet)
                json_alerts_return['Pais'] = locate;
                json_alerts_return[locate] = feed.items.filter(el => el.pubDate && el.pubDate.startsWith(date))
                break;
            default:
             
                const parser = new Parser({
                    customFields: {
                        item: []
                    }, requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                        }
                    }
                })
                const feedAlarms = await parser.parseURL("https://www.gdacs.org/xml/rss.xml");
                json_alerts_return['Pais'] = "Global_resources";
                json_alerts_return[locate] = feedAlarms;
                //console.log(json_alerts_return)
                break;
        }
        return json_alerts_return;
    } catch (error) {
        console.log(error)
        return { error: true, Message: String(error) }
    }
}
export default EngineAlarm;



