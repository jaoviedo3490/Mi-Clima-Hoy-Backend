
import Parser from 'rss-parser';

const EngineAlarm = async (locate) => {
    
    try {
        var json_alerts_return = {}
        switch (locate) {
            case "Colombia": break;
            default:
                const parser = new Parser({
                    customFields: {
                        item: [
                            ["gdacs:todate", "todate"],
                            ["gdacs:durationinweek", "durationinweek"],
                            ["gdacs:year", "year"],
                            ["gdacs:bbox", "bbox"],
                            ["gdacs:cap", "cap"],
                            ["gdacs:icon", "icon"],
                            ["gdacs:version", "version"],
                            ["gdacs:eventtype", "eventtype"],
                            ["gdacs:alertlevel", "alertlevel"],
                            ["gdacs:alertscore", "alertscore"],
                            ["gdacs:episodealertlevel", "episodealertlevel"],
                            ["gdacs:episodealertscore", "episodealertscore"],
                            ["gdacs:eventname", "eventname"],
                            ["gdacs:eventid", "eventid"],
                            ["gdacs:episodeid", "episodeid"],
                            ["gdacs:calculationtype", "calculationtype"],
                            ["gdacs:severity", "severity"],
                            ["gdacs:population", "population"],
                            ["gdacs:vulnerability", "vulnerability"],
                            ["gdacs:iso3", "iso3"],
                            ["gdacs:country", "country"],
                            ["gdacs:glide", "glide"],
                            ["gdacs:mapimage", "mapimage"],
                            ["gdacs:maplink", "maplink"],
                            ["gdacs:gtsimage", "gtsimage"],
                            ["gdacs:gtslink", "gtslink"],
                            ["gdacs:resources", "resources"],
                            ["gdacs:resource", "resource"],
                            ["gdacs:title", "title"],
                            ["gdacs:description", "description"],
                            ["gdacs:acknowledgements", "acknowledgements"],
                            ["gdacs:accesslevel", "accesslevel"]
                        ]
                    }, requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                        }
                    }
                })
                const feedAlarms = await parser.parseURL("https://www.gdacs.org/xml/rss.xml");
                json_alerts_return['all_global_alerts'] = feedAlarms;
                //console.log(json_alerts_return)
                break;
        }
        return json_alerts_return;
    } catch (error) {
          console.log(error)
        return { error: true, Message: error }
    }
}
export default EngineAlarm;
