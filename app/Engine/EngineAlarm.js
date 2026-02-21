
import Parser from 'rss-parser';
import ServicesDataSet from "../JsonData/ServicesDataSet.json";
import ServiceStrucData from "../JsonData/ServiceStructData.json"

const EngineAlarm = async (locate, anio, month, day) => {

    try {
        var json_alerts_return = {}
        //console.log("Pais: "+locate+"JSON_CONTENT:"+JSON.stringify(ServicesDataSet.AlarmPublicServices));
        let prefijo = ServicesDataSet.AlarmPublicServices.Countries[locate][0].prefijo;
        switch (prefijo) {
            case "cap":
                let dateFormat = new Date(anio, (month - 1), (day-1), 30).toString()
                let arr = dateFormat.split(" ");
                //console.log()
                const parserCountry = new Parser({
                    requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }
                });
                console.log("aqui"+ServicesDataSet.AlarmPublicServices.Countries[locate]);
                const feedCountry= await parserCountry.parseURL(ServicesDataSet.AlarmPublicServices.Countries[locate][0].url);
                json_alerts_return['prefijo'] = ServicesDataSet.AlarmPublicServices.Countries[locate][0].prefijo;
                json_alerts_return['Pais'] = locate;
                json_alerts_return['Date-Format'] = `${arr[0]}, ${arr[2]} ${arr[1]} ${arr[3]}`
                

                json_alerts_return[locate] = feedCountry.items.filter(el => el.pubDate && el.pubDate.startsWith(`${arr[0]}, ${arr[2]} ${arr[1]} ${arr[3]}`));
                break;
            case "none":
                if (ServicesDataSet.AlarmPublicServices.Countries[locate][0].type === "xml/rss") {
                    const parserTest = new Parser({ requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } } })
                    //console.log(ServicesDataSet.AlarmPublicServices.Countries[locate][0].url)
                    const feed = await parserTest.parseURL(ServicesDataSet.AlarmPublicServices.Countries[locate][0].url);
                    //console.log(ServicesDataSet)
                    json_alerts_return['prefijo'] = ServicesDataSet.AlarmPublicServices.Countries[locate][0].prefijo
                    json_alerts_return['Pais'] = locate;
                    json_alerts_return[locate] = feed.items.filter(el => el.pubDate && el.pubDate.startsWith(`${anio}-${month}-${day}`))
                } else {
                    json_alerts_return['prefijo'] = ServicesDataSet.AlarmPublicServices.Countries[locate][0].prefijo
                    json_alerts_return['Pais'] = locate;
                    json_alerts_return["Message"] = "Proceso no iniciado, porfavor registrar el prefijo y pais en el motor para mostrar las alertas"
                }
                break;
            default:
                json_alerts_return["error"] = false;
                json_alerts_return['Message'] = "Opcion no mapeada, porfavor validar que el prefijo o pais este registrado"
                break;
        }

        return json_alerts_return;
    } catch (error) {
        console.log(error)
        return { error: true, Message: String(error) }
    }
}
export default EngineAlarm;



