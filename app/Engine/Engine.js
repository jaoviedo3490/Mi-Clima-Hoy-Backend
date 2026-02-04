const Engine = (props, typeAlert_, climateAlert) => {
    try {
        const typeAlert = typeAlert_ //Recibe el tipo de alerta del componente padre
        //debugger;
        var Alerts, setAlert_Module_Second, setWarnings_Module_Second, Warnings; //Arreglo que guardara las alertas de las distintas metricas
        //Arreglo que guardara las advertencias de las distintas metricas
        var json_data_return = {}
        var qualityAirData,pronosticsData;
        let alerta = [];
        var nivelAlert
        var messageNubosity,messageHumidity;
        var qualityAirMessage,messagePrecipitacion,messageVelocidadViento
        var messagepm2_5,messagepm10
        var warningObject = {}
        var alertObject = {}
        //Estos son los rangos iniciales de los valores que generaran los alertamientos , se dividen en las distintas metricas evaluadas
        const rangos = {
            "Temperatura": [{ 'danger-freeze': [-500, -10], 'warning-freeze': [-9, 0], 'success-freeze': [1, 19], 'success': [20, 29], "warning-hot": [30, 34], "danger-hot": [35, 37], "xtreme-hot": [38, 10000], }],
            "Radiacion UV": [{ 'success': [0, 2], 'info': [3, 5], 'warning': [6, 7], "danger": [8, 10], 'xtreme': [10, 100] }],
            "Nubosidad": [{ "success": [0, 25], "info": [26, 50], "warning": [51, 75], "danger": [76, 100] }],
            "Humedad": [{ "success": [0, 25], "info": [26, 50], "warning": [51, 75], "danger": [76, 100] }],
            "Visibilidad": [{ "success": [11, 50], "info": [6, 10], "warning": [1, 5], "danger": [0, 1] }],
            "Quality-Air": [{ "success": [1, 1], "warning": [2, 4], "danger": [5, 6] }],
            "MonoCarbono": [{ "success": [0, 9], "info": [10, 50], "warning": [51, 100], "danger": [101, 200], "primary": [201, 500] }],
            "DioNitrogeno": [{ "success": [0, 0.053], "info": [0.054, 0.1], "warning": [0.101, 0.2], "danger": [0.2, 500] }],
            "DioAzufre": [{ "success": [0, 0.017], "info": [0.01701, 0.075], "warning": [0.076, 0.5], "danger": [0.5, 5] }],
            "Ozono": [{ "success": [0, 0.03], "info": [0.04, 0.06], "warning": [0.07, 0.10], "danger": [0.10, 0.030] }],
            "Precipitacion": [{ "success": [0, 2], "info": [2.1, 10], "warning": [10.1, 30], "danger": [30, 70] }],
            "PM10": [{ "success": [0, 54], "info": [55, 154], "warning": [155, 254], "danger": [255, 354], "xtreme": [355, 999] }],
            "PM2_5": [{ "success": [0, 12], "info": [12.1, 35.4], "warning": [35.5, 55.4], "danger": [55.5, 200] }],
            "Velocidad-Viento": [{ "success": [0, 19], "info": [19.1, 39.9], "warning": [40, 65], "danger": [55, 300] }],
        };

        //Estas son las alertas que se generaran para cada metrica teniendo en cuenta los rangos anteriores
        const alertas = {
            "Temperatura": {
                "danger-freeze": { "color": "#c53f3fff", "titulo": "Peligro", "Message": `La Temperatura actual es de ${climateAlert.current.temp_c} C°, esta Temperatura es muy peligrosa,  por favor use la vestimenta adecuada ,  NO se exponga al frio exterior , evite movimientos innecesarios para evitar la perdida de calor y busque inmediatamente un lugar con calefacción.` },
                'warning-freeze': { "color": "#FF9800", "titulo": "Advertencia", "Message": `La Temperatura actual es de ${climateAlert.current.temp_c} C°, se recomienda el uso de calefacción y ropa adecuada para evitar la perdida de calor.` },
                'success-freeze': { "color": "#4fd6ffff", "titulo": "Importante", "Message": `La Temperatura actual es de ${climateAlert.current.temp_c} C°, esta Temperatura es segura para salir, sin embargo se recomienda el uso de ropa adecuada para evitar la perdida de calor.` },
                'success': { "color": "#3fc555ff", "titulo": "Importante", "Message": `La Temperatura actual es de ${climateAlert.current.temp_c} C°, esta Temperatura es segura para salir.` },
                'warning-hot': { "color": "#3fa6c5ff", "titulo": "Advertencia", "Message": `La Temperatura actual es de ${climateAlert.current.temp_c} C°, esta Temperatura es segura para salir, sin embargo se recomienda usar ropa ligera y consumir líquidos para evitar la deshidratación.` },
                'danger-hot': { "color": "#FF9800", "titulo": "Peligro", "Message": `La Temperatura actual es de ${climateAlert.current.temp_c} C°, se recomienda el uso de ropa ligera y evitar los abiertos, el uso de aire acondicionado si es posible o acudir a un área de menor Temperatura, además del consumo continuo de líquidos para evitar la deshidratación.` },
                'xtreme-hot': { "color": "#c53f3fff", "titulo": "Peligro", "Message": `La Temperatura actual es de ${climateAlert.current.temp_c} C°, esta Temperatura es altamente peligrosa, se recomienda acudir inmediatamente a un sitio de menor Temperatura, mantenerse hidratado y evitar realizar movimientos innecesarios.` }
            },
            "Radiacion UV": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": `El nivel actual de Radiación UV es ${climateAlert.current.uv}, este nivel de radiación es bajo, es seguro la exposición la misma.` },
                "info": { "color": "#3fa6c5ff", "titulo": "Importante", "Message": `El nivel actual de Radiación UV es ${climateAlert.current.uv}, este nivel de radiación es moderado, es seguro la exposición  la misma, sin embargo se recomienda por poco tiempo.` },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": `El nivel actual de Radiación UV es ${climateAlert.current.uv}, este nivel de radiación es alto, se recomienda el uso de protector solar para evitar quemaduras en la piel y por poco tiempo.` },
                "danger": { "color": "#c53f3fff", "titulo": "Peligro", "Message": `El nivel actual de Radiación UV es ${climateAlert.current.uv}, este nivel de radiación es muy alto, se recomienda evitar la exposición a los rayos del sol, aun con el uso de protector solar.` },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": `El nivel actual de Radiación UV es ${climateAlert.current.uv}, este nivel de radiación es peligroso, se recomienda evitar la exposición a los rayos del sol, aun con el uso de protector solar.` },
            },
            "Nubosidad": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "Humedad": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "Visibilidad": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "Quality-Air": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "MonoCarbono": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "DioNitrogeno": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "DioAzufre": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "Ozono": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "PM10": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "PM2_5": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            }
            ,
            "Precipitacion": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            },
            "Velocidad-Viento": {
                "success": { "color": "#3fc555ff", "titulo": "Importante", "Message": undefined, "alert": 'success' },
                "info": { "color": "#00acf0ff", "titulo": "Importante", "Message": undefined, "alert": 'info' },
                "warning": { "color": "#F18B00", "titulo": "Advertencia", "Message": undefined, "alert": 'warning' },
                "danger": { "color": "#dd0000ff", "titulo": "Peligro", "Message": undefined, "alert": 'error' },
                "xtreme": { "color": "#B567A4", "titulo": "Peligro", "Message": undefined, "alert": 'xtreme' }
            }
        }

        const getAlert = (value, tipo) => {
            let alertType = 0;

            for (const propiedad in rangos) {
                const valoresPropiedad = rangos[propiedad][0];
                for (const nivel in valoresPropiedad) {
                    const valoresNivel = valoresPropiedad[nivel];
                    const a = valoresNivel.find((element) => (parseInt(value) >= valoresNivel[0]) && (parseInt(value) <= valoresNivel[1]));
                    if (a !== undefined && propiedad === tipo) {
                        alertType = nivel;
                        break;
                    }
                }
            } return alertType;
        }
        /*La funcion getAlert sirve para determinar el alertamiento de una metrica , toma como 
        parametros el valor de la metrica a evaluar y como segundo parametro el tipo de metrica
        por ejemplo: si se evalua la temperatura seria: getAlert("38",Temperatura) devolviendo 
        una de las claves de los rangos , en el ejemplo la funcion devolveria: "xtreme-hot"*/





        /*Aqui se generan los alertamientos de "Peligro" o "Advertencia" mediante el tipo de alerta , 
        para que cada vez que cambie el tipo de alerta y el valor de la metrica ,
        ejemplo la temperatura o la radiacion ,se evalue una nueva alerta*/



        switch (typeAlert) {
            case "Temperatura":
                //console.log("a ver")
                //console.log(typeAlert)
                nivelAlert = getAlert(climateAlert.current.temp_c, typeAlert);

                if (alertas["Temperatura"][nivelAlert]?.titulo === 'Peligro') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });*/

                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Peligro"
                    */

                    alertObject = {
                        alertBody: alertas["Temperatura"][nivelAlert],
                        value: climateAlert.current.temp_c,
                        type: `${typeAlert} (Valores Peligrosos)`
                    }

                    /*
                    *Si el nivel de alerta es "Peligro" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    Alerts = ((prev) => {

                        /* 
                        *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                        *Mediante el tipo de alerta almacenada en la propiedad type
                        */

                        const updated = [...prev, alertObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });


                    Warnings = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });


                }
                if (alertas["Temperatura"][nivelAlert]?.titulo === 'Advertencia') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });
                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Advertencia"
                    */

                    warningObject = {
                        alertBody: alertas["Temperatura"][nivelAlert],
                        value: climateAlert.current.temp_c,
                        type: `${typeAlert} (Valores de riesgo moderado)`
                    }


                    /*
                    *Si el nivel de alerta es "Advertencia" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    Warnings = ((prev) => {

                        /* 
                       *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                       *Mediante el tipo de alerta almacenada en la propiedad type
                       */

                        const updated = [...prev, warningObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });
                    Alerts = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });
                }
                if (alertas["Temperatura"][nivelAlert]?.titulo !== 'Advertencia' && alertas["Temperatura"][nivelAlert]?.titulo !== 'Peligro') {

                    /*
                    *Si el nivel de alerta no es ni "Peligro" ni "Advertencia", 
                    *se limpian ambos arreglos de cualquier registro previo de esta metrica
                    *para evitar que se muestren alertas o advertencias que ya no aplican
                    */

                    Alerts = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });

                    Warnings = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });
                }


                json_data_return["Temperatura"] = {

                    IndicatorGraph: {
                        min: -50, max: 40, type: "Temperatura", unit: "C°",
                        split: 3, data: climateAlert.current.temp_c,
                        //recomendaciones: alertas["Temperatura"][nivelAlert]?.Message || 'No disponible',
                        optionalData: climateAlert.current.feelslike_c, MetricsData: alertas["Temperatura"][nivelAlert]
                    },
                    Alertas: alertObject,
                    Advertencias: warningObject
                }
                break;

            case "Radiacion UV":
                const nivelAlertUv = getAlert(climateAlert.current.uv, typeAlert);
                //setNivelAlertaUV(nivelAlertUv);

                if (alertas["Radiacion UV"][nivelAlertUv]?.titulo === 'Peligro') {
                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });
    
                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Peligro" para Radiacion UV
                    */

                    alertObject = {
                        alertBody: alertas["Radiacion UV"][nivelAlertUv],
                        value: climateAlert.current.uv,
                        type: `${typeAlert} (Valores Peligrosos)`
                    }

                    /*
                    *Si el nivel de alerta es "Peligro" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    Alerts = ((prev) => {

                        /* 
                        *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                        *Mediante el tipo de alerta almacenada en la propiedad type
                        */

                        const updated = [...prev, alertObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });

                    Warnings = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una radiacion UV que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });
                }

                if (alertas["Radiacion UV"][nivelAlertUv]?.titulo === 'Advertencia') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });
                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Advertencia" para Radiacion UV
                    */

                    warningObject = {
                        alertBody: alertas["Radiacion UV"][nivelAlertUv],
                        value: climateAlert.current.uv,
                        type: `${typeAlert} (Valores de riesgo moderado)`
                    }

                    Warnings = ((prev) => {

                        /* 
                       *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                       *Mediante el tipo de alerta almacenada en la propiedad type
                       */

                        const updated = [...prev, warningObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });

                    Alerts = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una radiacion UV que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });
                }

                if (alertas["Radiacion UV"][nivelAlertUv]?.titulo !== 'Advertencia' && alertas["Radiacion UV"][nivelAlertUv]?.titulo !== 'Peligro') {

                    /*
                    *Si el nivel de alerta no es ni "Peligro" ni "Advertencia", 
                    *se limpian ambos arreglos de cualquier registro previo de esta metrica
                    *para evitar que se muestren alertas o advertencias que ya no aplican
                    */

                    Alerts = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });

                    Warnings = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });
                }


                json_data_return["Radiacion UV"] = {

                    IndicatorGraph: {
                        min: 0, max: 20, type: "Radiacion UV", unit: "UV",
                        split: 2, data: climateAlert.current.uv,
                        //recomendaciones: alertas["Radiacion UV"][nivelAlertUv]?.Message || 'No disponible',
                        MetricsData: alertas["Radiacion UV"][nivelAlertUv] || 'No disponible',
                        optionalData: 6
                    },
                    Alerts: alertObject,
                    Warnings: warningObject
                }
                break;
            case 'Nubosidad':
                 messageNubosity = (climateAlert.current.temp_c < -40 || climateAlert.current.temp_c > 40) ? `Peligro extremo: la Temperatura es muy peligrosa. Busca refugio en un ambiente más estable y evita salir al exterior.` :
                    (climateAlert.current.temp_c >= -40 && climateAlert.current.temp_c <= 15) ? (
                        (climateAlert.current.cloud >= 0 && climateAlert.current.cloud <= 25) ? `Cielos despejados con alta visibilidad. Abrígate bien y usa gafas de sol para reducir el deslumbramiento en áreas de nieve o hielo. Lleva ropa térmica.` :
                            (climateAlert.current.cloud > 25 && climateAlert.current.cloud <= 50) ? `Cielos parcialmente nublados. Aunque algo menos frío, usa ropa de invierno. Lleva gorro, bufanda y guantes para mantener el calor.` :
                                (climateAlert.current.cloud > 50 && climateAlert.current.cloud <= 75) ? `Nubosidad moderada. Esto ayuda a retener algo de calor ambiental. Usa varias capas y mantente protegido del viento.` :
                                    (climateAlert.current.cloud > 75 && climateAlert.current.cloud <= 100) ? `Alta cobertura nubosa. El frío puede ser intenso, y podría llover o nevar. Usa ropa impermeable y protégete bien del frío.` : `Definición no encontrada`
                    ) : (climateAlert.current.temp_c > 15 && climateAlert.current.temp_c <= 25) ? (
                        (climateAlert.current.cloud >= 0 && climateAlert.current.cloud <= 25) ? `Ambiente despejado. Usa ropa ligera y protector solar si es de día, y mantente hidratado si el aire está seco.` :
                            (climateAlert.current.cloud > 25 && climateAlert.current.cloud <= 50) ? `Nubosidad ligera. Puedes optar por ropa cómoda y ligera, y no olvides protegerte del sol durante el día.` :
                                (climateAlert.current.cloud > 50 && climateAlert.current.cloud <= 75) ? `Moderada cobertura nubosa. Viste de manera cómoda, y una chaqueta ligera si la Temperatura baja en la noche.` :
                                    (climateAlert.current.cloud > 75 && climateAlert.current.cloud <= 100) ? `Nubosidad densa. La Temperatura se mantendrá estable. Viste de manera cómoda y lleva una capa ligera si fuera necesario.` : `Definición no encontrada`
                    ) : (climateAlert.current.temp_c > 25 && climateAlert.current.temp_c <= 40) ? (
                        (climateAlert.current.cloud >= 0 && climateAlert.current.cloud <= 25) ? `Cielos despejados con calor intenso. Usa ropa fresca, gorra y protector solar. Lleva agua para mantenerte hidratado.` :
                            (climateAlert.current.cloud > 25 && climateAlert.current.cloud <= 50) ? `Algunas nubes que proporcionan sombra parcial. Usa ropa fresca y mantente hidratado para evitar el agotamiento.` :
                                (climateAlert.current.cloud > 50 && climateAlert.current.cloud <= 75) ? `Moderada cobertura nubosa. Usa ropa ligera, y lleva agua para mantenerte fresco.` :
                                    (climateAlert.current.cloud > 75 && climateAlert.current.cloud <= 100) ? `Alta cobertura nubosa. Puede sentirse bochornoso. Usa ropa ligera y fresca, y mantente hidratado.` : `Definición no encontrada`
                    ) : `Definición no encontrada`;


                const nivelAlertNubosidad = getAlert(climateAlert.current.cloud, typeAlert);
                alertas["Nubosidad"][nivelAlertNubosidad].Message = messageNubosity;

                if (climateAlert.current.temp_c <= -40 || climateAlert.current.temp_c >= 40) {

                    alerta = alertas["Nubosidad"][nivelAlertNubosidad].alert = "error";
                    //setDataNubosidad(alerta);
                }
                //setDataNubosidad(alertas["Nubosidad"][nivelAlertNubosidad]);

                pronosticsData['Nubosidad'] = {
                    data: climateAlert.current.cloud,
                    MetricsData: alertas["Nubosidad"][nivelAlertNubosidad]
                }
                break;
            case 'Humedad':
                messageHumidity = (climateAlert.current.temp_c < -40 || climateAlert.current.temp_c > 40) ? `Peligro extremo: la Temperatura es muy peligrosa. Busca refugio en un ambiente más estable y evita salir al exterior.` :
                    (climateAlert.current.temp_c >= -40 && climateAlert.current.temp_c) ? (
                        (climateAlert.current.humidity >= 0 && climateAlert.current.humidity <= 30) ? `Clima frío y seco. Hidrata tu piel y vías respiratorias, y considera un humidificador portátil si estarás mucho tiempo al aire libre.` :
                            (climateAlert.current.humidity > 30 && climateAlert.current.humidity <= 60) ? `Clima frío y con humedad moderada. Lleva abrigo impermeable y asegúrate de mantenerte caliente, especialmente si la humedad causa sensación de frío.` :
                                (climateAlert.current.humidity > 60 && climateAlert.current.humidity <= 100) ? `Clima frío y húmedo. Abrígate bien y lleva una capa adicional resistente al agua, ya que la alta humedad intensifica la sensación de frío.` : `Definición no encontrada`
                    ) : (climateAlert.current.temp_c > 15 && climateAlert.current.temp_c <= 25) ? (
                        (climateAlert.current.humidity >= 0 && climateAlert.current.humidity <= 30) ? `Clima templado y seco. Lleva agua y mantente hidratado, ya que el aire seco puede resecar tu piel y garganta.` :
                            (climateAlert.current.humidity > 30 && climateAlert.current.humidity <= 60) ? `Clima templado con humedad moderada. Es un ambiente cómodo para salir; solo lleva agua si realizarás actividad física.` :
                                (climateAlert.current.humidity > 60 && climateAlert.current.humidity <= 100) ? `Clima templado y húmedo. Lleva ropa ligera y transpirable, ya que la alta humedad puede causar sensación de bochorno.` : `Definición no encontrada`
                    ) : (climateAlert.current.temp_c > 25 && climateAlert.current.temp_c <= 40) ? (
                        (climateAlert.current.humidity >= 0 && climateAlert.current.humidity <= 30) ? `Clima cálido y seco. Lleva agua, protector solar, y viste ropa ligera para evitar deshidratación.` :
                            (climateAlert.current.humidity > 30 && climateAlert.current.humidity <= 60) ? `Clima cálido con humedad moderada. Lleva agua y evita la exposición prolongada al sol directo para evitar el agotamiento.` :
                                (climateAlert.current.humidity > 60 && climateAlert.current.humidity <= 100) ? `Clima cálido y húmedo. La sensación de calor puede ser sofocante. Viste ropa transpirable, hidrátate bien, y busca sombra siempre que puedas.` : `Definición no encontrada`
                    ) : `Definición no encontrada`;


                const nivelAlertHumidity = getAlert(climateAlert.current.humidity, typeAlert);
                alertas["Humedad"][nivelAlertHumidity].Message = messageHumidity;
                if (climateAlert.current.temp_c <= -40 || climateAlert.current.temp_c >= 40) {
                    alertas["Humedad"][nivelAlertHumidity].alert = 'error';
                    //setDataHumedad(alerta);
                }


                //setDataHumedad(alertas["Humedad"][nivelAlertHumidity]);

                pronosticsData['Humedad'] = {
                    data: climateAlert.current.humidity,
                    MetricsData: alertas["Humedad"][nivelAlertNubosidad]
                }

                break;

            case 'Visibilidad':

                const nivelAlerVisibilidad = getAlert(climateAlert.current.vis_km, typeAlert);
                const messageVisibilty = (climateAlert.current.temp_c >= 40 || climateAlert.current.temp_c <= -40) ? `Peligro extremo: la Temperatura es muy peligrosa. Busca refugio en un ambiente más estable y evita salir al exterior.` : (props.data >= 0 && props.data <= 1) ? `Visibilidad extremadamente baja. Evita conducir o salir si no es necesario, y usa luces de emergencia si debes moverte.` :
                    (climateAlert.current.vis_km > 1 && climateAlert.current.vis_km <= 5) ? `Visibilidad reducida. Si sales, toma precauciones al moverte, especialmente al conducir, y usa luces bajas para mejor visibilidad.` :
                        (climateAlert.current.vis_km > 5 && climateAlert.current.vis_km <= 10) ? `Visibilidad moderada. Es seguro salir, pero mantente alerta en áreas con poca iluminación o en caminos desconocidos.` :
                            (climateAlert.current.vis_km > 10 && climateAlert.current.vis_km <= 50) ? `Visibilidad clara. Las condiciones son favorables para cualquier actividad al aire libre.` :
                                `Definicion no encontrada`;

                alertas['Visibilidad'][nivelAlerVisibilidad].Message = messageVisibilty;

                if (climateAlert.current.temp_c <= -40 || climateAlert.current.temp_c >= 40) {
                    alerta = alertas["Visibilidad"][nivelAlerVisibilidad].alert = 'error';
                    //setDataVisibilidad(alerta);
                }
                //setDataVisibilidad(alertas["Visibilidad"][nivelAlerVisibilidad]);


                pronosticsData['Nubosidad'] = {
                    data: climateAlert.current.vis_km,
                    MetricsData: alertas["Nubosidad"][nivelAlertNubosidad]
                }
                break;
            case "Quality-Air":

                const nivelAlertaQualityAir = getAlert(climateAlert.current.air_quality["us-epa-index"], typeAlert);
                if (alertas["Quality-Air"][nivelAlertaQualityAir]?.titulo === 'Peligro') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });*/

                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Peligro"
                    */

                    alertObject = {
                        alertBody: alertas["Quality-Air"][nivelAlertaQualityAir],
                        value: climateAlert.current.air_quality["us-epa-index"],
                        type: `${typeAlert} (Valores Peligrosos)`
                    }

                    /*
                    *Si el nivel de alerta es "Peligro" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    setAlert_Module_Second = ((prev) => {

                        /* 
                        *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                        *Mediante el tipo de alerta almacenada en la propiedad type
                        */

                        const updated = [...prev, alertObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });


                    setWarnings_Module_Second = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });


                }

                if (alertas["Quality-Air"][nivelAlertaQualityAir]?.titulo === 'Advertencia') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });
                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Advertencia"
                    */

                    warningObject = {
                        alertBody: alertas["Quality-Air"][nivelAlertaQualityAir],
                        value: climateAlert.current.air_quality["us-epa-index"],
                        type: `${typeAlert} (Valores de riesgo moderado)`
                    }


                    /*
                    *Si el nivel de alerta es "Advertencia" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    setWarnings_Module_Second = ((prev) => {

                        /* 
                       *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                       *Mediante el tipo de alerta almacenada en la propiedad type
                       */

                        const updated = [...prev, warningObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });
                    setAlert_Module_Second = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });
                } if (alertas["Quality-Air"][nivelAlertaQualityAir]?.titulo !== 'Advertencia' && alertas["Quality-Air"][nivelAlertaQualityAir]?.titulo !== 'Peligro') {

                    /*
                    *Si el nivel de alerta no es ni "Peligro" ni "Advertencia", 
                    *se limpian ambos arreglos de cualquier registro previo de esta metrica
                    *para evitar que se muestren alertas o advertencias que ya no aplican
                    */

                    setAlert_Module_Second = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });

                    setWarnings_Module_Second = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });
                }




                qualityAirMessage = (climateAlert.current.air_quality['us-epa-index'] == 1) ? `La calidad del aire es *Buena* y no representa riesgo para la salud , No se requieren precauciones.` :
                    (climateAlert.current.air_quality['us-epa-index'] == 2) ? `La calidad del aire es *Moderada*, pero algunas personas sensibles pueden experimentar molestias leves , Si eres sensible (asma o enfermedades respiratorias), limita el esfuerzo físico al aire.` :
                        (climateAlert.current.air_quality['us-epa-index'] == 3) ? ` La calidad del aire es *No saludable para grupos sensibles* , personas con enfermedades respiratorias, niños y adultos mayores pueden verse afectados , se recomienda evitar actividades al aire libre si perteneces a un grupo de riesgo. Usa mascarilla si es necesario.` :
                            (climateAlert.current.air_quality['us-epa-index'] == 4) ? `La calidad del aire es *Insalubre* , Toda la población puede experimentar efectos adversos, especialmente personas con problemas respiratorios , Reduce la actividad al aire libre, usa purificadores de aire en casa y evita zonas con alta contaminación.` :
                                (climateAlert.current.air_quality['us-epa-index'] == 5) ? `La calidad del aire es peligrosa , Aumentan los riesgos de salud para toda la población. Se recomienda evitar la exposición prolongada , Permanece en interiores, usa mascarilla si debes salir y mantén cerradas puertas y ventanas.` :
                                    (climateAlert.current.air_quality['us-epa-index'] == 6) ? `La calidad del aire es altamente peligrosa,  La contaminación es extrema y puede afectar gravemente a toda la población, evita salir, usa purificadores y sigue indicaciones de las autoridades locales para reducir la exposición.` : `Definicion no encontrada`

                alertas['Quality-Air'][nivelAlertaQualityAir].Message = qualityAirMessage;
                //setDataQualityAir(alertas['Quality-Air'][nivelAlertaQualityAir]);
                json_data_return["Quality-Air"] = {

                    IndicatorGraph: {
                        min: 0, max: 6, type: "Quality-Air", unit: "a",
                        split: 2, data: climateAlert.current.air_quality['us-epa-index'],
                        //recomendaciones: qualityAirMessage,
                        optionalData: 3, MetricsData: alertas["Quality-Air"][nivelAlertaQualityAir]
                    },
                    Alerts: alertObject,
                    Warnings: warningObject
                }
                break;


            case "Precipitacion":
                const nivelAlertaPrecipitation = getAlert(climateAlert.current.precip_mm, typeAlert);
                if (alertas["Precipitacion"][nivelAlertaPrecipitation]?.titulo === 'Peligro') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });*/

                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Peligro"
                    */

                    alertObject = {
                        alertBody: alertas["Precipitacion"][nivelAlertaPrecipitation],
                        value: climateAlert.current.precip_mm,
                        type: `${typeAlert} (Valores Peligrosos)`
                    }

                    /*
                    *Si el nivel de alerta es "Peligro" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    setAlert_Module_Second = ((prev) => {

                        /* 
                        *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                        *Mediante el tipo de alerta almacenada en la propiedad type
                        */

                        const updated = [...prev, alertObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });


                    setWarnings_Module_Second = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });


                } if (alertas["Precipitacion"][nivelAlertaPrecipitation]?.titulo === 'Advertencia') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });
                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Advertencia"
                    */

                    warningObject = {
                        alertBody: alertas["Precipitacion"][nivelAlertaPrecipitation],
                        value: climateAlert.current.precip_mm,
                        type: `${typeAlert} (Valores de riesgo moderado)`
                    }


                    /*
                    *Si el nivel de alerta es "Advertencia" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    setWarnings_Module_Second = ((prev) => {

                        /* 
                       *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                       *Mediante el tipo de alerta almacenada en la propiedad type
                       */

                        const updated = [...prev, warningObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });
                    setAlert_Module_Second = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });
                } if (alertas["Precipitacion"][nivelAlertaPrecipitation]?.titulo !== 'Advertencia' && alertas["Precipitacion"][nivelAlertaPrecipitation]?.titulo !== 'Peligro') {

                    /*
                    *Si el nivel de alerta no es ni "Peligro" ni "Advertencia", 
                    *se limpian ambos arreglos de cualquier registro previo de esta metrica
                    *para evitar que se muestren alertas o advertencias que ya no aplican
                    */

                    setAlert_Module_Second = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });

                    setWarnings_Module_Second = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });
                }
                messagePrecipitacion =
                    (climateAlert.current.precip_mm >= 0 && climateAlert.current.precip_mm <= 2)
                        ? `Lluvia ausente o muy ligera. Puedes desplazarte con normalidad. Aun así, lleva una chaqueta ligera si estarás fuera por varias horas, especialmente en moto o bici.`
                        : (climateAlert.current.precip_mm > 2 && climateAlert.current.precip_mm <= 10)
                            ? `Lluvia ligera a moderada. Lleva paraguas o impermeable, y usa calzado que no se resbale. Si conduces, ten precaución: el pavimento puede estar húmedo y más resbaloso de lo normal.`
                            : (climateAlert.current.precip_mm > 10 && climateAlert.current.precip_mm <= 30)
                                ? `Lluvia moderada a fuerte. Evita permanecer mucho tiempo a la intemperie. Revisa que puertas y ventanas estén bien cerradas y procura no circular en moto o bici durante los picos de lluvia. Si conduces, reduce la velocidad y aumenta la distancia con otros vehículos.`
                                : (climateAlert.current.precip_mm > 30 && climateAlert.current.precip_mm <= 70)
                                    ? `Lluvia muy fuerte con riesgo de encharcamientos e inundaciones en zonas vulnerables. Evita salir si no es necesario, sobre todo a pie o en moto. No cruces calles o vías con acumulación de agua y mantente atento a reportes oficiales sobre inundaciones o deslizamientos.`
                                    : `Definición no encontrada`;


                alertas['Precipitacion'][nivelAlertaPrecipitation].Message = messagePrecipitacion;

                json_data_return["Precipitacion"] = {

                    IndicatorGraph: {
                        min: 0, max: 40, type: "Precipitacion", indicator: "mm",
                        split: 2, data: climateAlert.current.precip_mm, 
                       // recomendaciones: messagePrecipitacion,
                        optionalData: 12, MetricsData: alertas["Precipitacion"][nivelAlertaPrecipitation]
                    },
                    Alerts: alertObject,
                    Warnings: warningObject
                }
                break;
            case "Velocidad-Viento":
                const nivelAlertaVelocidadViento = getAlert(climateAlert.current.wind_kph, typeAlert);
                if (alertas["Velocidad-Viento"][nivelAlertaVelocidadViento]?.titulo === 'Peligro') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });*/

                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Peligro"
                    */

                    alertObject = {
                        alertBody: alertas["Velocidad-Viento"][nivelAlertaVelocidadViento],
                        value: climateAlert.current.wind_kph,
                        type: `${typeAlert} (Valores Peligrosos)`
                    }

                    /*
                    *Si el nivel de alerta es "Peligro" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    setAlert_Module_Second = ((prev) => {

                        /* 
                        *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                        *Mediante el tipo de alerta almacenada en la propiedad type
                        */

                        const updated = [...prev, alertObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });


                    setWarnings_Module_Second = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });


                } if (alertas["Velocidad-Viento"][nivelAlertaVelocidadViento]?.titulo === 'Advertencia') {

                    /*Notification.requestPermission().then(function (result) {
    
                        if (result === 'granted') {
                            new Notification("Alerta detectada, por favor revisar en el panel principal")
                        }
    
                    });
                    /*
                    *Aqui se evalua el objeto que devuelve getAlert , mediante el titulo ,
                    *asi se puede determinar el nivel de alerta, en este caso aqui se genera
                    *las alertas de nivel "Advertencia"
                    */

                    warningObject = {
                        alertBody: alertas["Velocidad-Viento"][nivelAlertaVelocidadViento],
                        value: climateAlert.current.wind_kph,
                        type: `${typeAlert} (Valores de riesgo moderado)`
                    }


                    /*
                    *Si el nivel de alerta es "Advertencia" se genera un json que contiene
                    *el cuerpo de la alerta siendo el objeto que devuelve getAlert , el valor de la metrica
                    *y el tipo de alerta, el tipo de alerta se usara para poder diferenciar 
                    *entre las alertas a que metrica almacenada corresponde 
                    */

                    setWarnings_Module_Second = ((prev) => {

                        /* 
                       *Aqui se realiza un filtrado de las alertas para evitar alertas duplicadas
                       *Mediante el tipo de alerta almacenada en la propiedad type
                       */

                        const updated = [...prev, warningObject];
                        const arrTemp = updated.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type === obj.type)
                        );
                        return arrTemp;
                    });
                    setAlert_Module_Second = ((prev) => {

                        /*
                        *Cuando un valor de métrica cambia y genera una nueva alerta o advertencia,
                        * se debe eliminar cualquier registro previo de la misma métrica en el arreglo contrario.
                        * Ejemplo: Si una temperatura que estaba en "Advertencia" ahora genera una "Alerta" de peligro,
                        * se remueve del arreglo de Warnings y se agrega al arreglo de Alerts.
                        * Esto evita que una misma métrica aparezca simultáneamente como alerta y advertencia.
                        */

                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });
                } if (alertas["Velocidad-Viento"][nivelAlertaVelocidadViento]?.titulo !== 'Advertencia' && alertas["Velocidad-Viento"][nivelAlertaVelocidadViento]?.titulo !== 'Peligro') {

                    /*
                    *Si el nivel de alerta no es ni "Peligro" ni "Advertencia", 
                    *se limpian ambos arreglos de cualquier registro previo de esta metrica
                    *para evitar que se muestren alertas o advertencias que ya no aplican
                    */

                    setAlert_Module_Second = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores Peligrosos)`)
                        );
                        return arrTemp;
                    });

                    setWarnings_Module_Second = ((prev) => {
                        const arrTemp = prev.filter(
                            (obj, i, arr) => i === arr.findIndex(o => o.type !== `${typeAlert} (Valores de riesgo moderado)`)
                        );
                        return arrTemp;
                    });
                }
                messageVelocidadViento =
                    (climateAlert.current.wind_kph >= 0 && climateAlert.current.wind_kph <= 19)
                        ? `Viento suave a moderado. Las actividades al aire libre son seguras. Aun así, asegúrate de que objetos livianos como sombrillas o lonas estén bien sujetos.`
                        : (climateAlert.current.wind_kph > 19 && climateAlert.current.wind_kph <= 39.9)
                            ? `Viento moderado a algo fuerte. Puede incomodar al caminar o ir en bici y mover ramas y objetos livianos. Asegura bien ventanas, puertas y elementos sueltos en balcones o terrazas.`
                            : (climateAlert.current.wind_kph >= 40 && climateAlert.current.wind_kph <= 65)
                                ? `Viento fuerte. Evita usar sombrillas, ten mucha precaución si te desplazas en moto o bicicleta y limita actividades al aire libre en espacios abiertos. Asegura bien techos livianos, avisos y objetos que puedan salir volando.`
                                : (climateAlert.current.wind_kph > 65 && climateAlert.current.wind_kph <= 100)
                                    ? `Viento muy fuerte con riesgo de daños materiales. Evita salir si no es estrictamente necesario, especialmente en moto o bici. Ten cuidado con árboles, postes y estructuras inestables, y mantente atento a comunicados oficiales sobre eventos extremos.`
                                    : `Definición no encontrada`;
                alertas["Velocidad-Viento"][nivelAlertaVelocidadViento].Message = messageVelocidadViento || 0;

                json_data_return["Velocidad-Viento"] = {

                    IndicatorGraph: {
                        min: 0, max: 100, type: "Velocidad-Viento", unit: "KM",
                        split: 2, data: climateAlert.current.wind_kph,
                        //recomendaciones: messageVelocidadViento,
                        optionalData: 65, MetricsData: alertas["Velocidad-Viento"][nivelAlertaVelocidadViento]
                    },
                    Alerts: alertObject,
                    Warnings: warningObject
                }
                break;
            case "MonoCarbono":

                //debugger;
                const co = ((climateAlert.current.air_quality.co * 24.45) / 28.01) / 1000;
                const nivelAlertaMonoCarbono = getAlert(co, typeAlert);

                const messageCo = (co >= 0 && co <= 9) ? `Monoxido de carbono: Nivel seguro (0 - 9 ppm : partes por millon). No se esperan efectos adversos en la salud, No se requieren medidas de precaución.` :
                    (co > 9 && co <= 50) ? `Monoxido de carbono: Moderado ( Mayor a 10 - 50 ppm : partes por millon). Puede causar leves dolores de cabeza y mareos tras una exposición prolongada. Limita actividades físicas intensas al aire libre si eres sensible al CO. Personas con condiciones respiratorias preexistentes deben tener precaución.` :
                        (co > 50 && co <= 100) ? `Monoxido de carbono: Nivel Peligroso (mayor a 50 - 100 ppm : partes por millon). Dolores de cabeza más intensos, mareos y náuseas después de 1-2 horas de exposición. Se recomienda evacuar el área afectada, Identificar y corregir fuentes de emisión de CO. Considerar el uso de detectores de CO en áreas propensas a acumulaciones.` :
                            (co > 100 && co <= 200) ? `Monoxido de carbono: Nivel altamente peligroso (mayor a 100 - 200 ppm : partes por millon). Pérdida de coordinación, confusión y posible desmayo tras exposiciones prolongadas. Evacuar el area afectada evitando al maximo la exposición. Buscar atención médica si se presentan síntomas. Implementar medidas para eliminar fuentes de CO y mejorar la ventilación.` :
                                (co > 200) ? `Niveles de monoxido extremos se presenta riesgo de daño cerebral, coma y muerte con exposiciones prolongadas. Evacuación inmediata del área, buscar atención médica urgente para los afectados. Identificar y eliminar de inmediato las fuentes de CO.` : `Definción no encontrada`;

                alertas?.MonoCarbono?.[nivelAlertaMonoCarbono] &&
                    (alertas.MonoCarbono[nivelAlertaMonoCarbono].Message = messageCo);

                //setMonoCarbono(alertas['MonoCarbono'][nivelAlertaMonoCarbono]);

                //const o3 = ((climateAlert.current.air_quality.o3 * 24.45) / 48) / 1000;
                qualityAirData['MonoCarbono'] = {
                    data: co,
                    MetricsData: alertas["MonoCarbono"][nivelAlertNubosidad]
                }
                json_data_return['Quality-Air-Components'] = qualityAirData;
                break;
            case "DioNitrogeno":
                //debugger;

                const no2 = ((climateAlert.current.air_quality.no2 * 24.45) / 46.0055) / 1000;
                const nivelAlertaDioNitrogeno = getAlert(no2, typeAlert);
                //console.log(typeAlert)
                //console.log(no2)
                const messageNO2 =
                    (no2 >= 0 && no2 <= 0.053) ?
                        `Dióxido de nitrógeno: Nivel bueno (0 - 0.053 ppm). Calidad de aire óptima. No se esperan efectos adversos para la población general.` :
                        (no2 > 0.053 && no2 <= 0.1) ?
                            `Dióxido de nitrógeno: Nivel moderado (0.054 - 0.1 ppm). Puede causar irritación leve en ojos y vías respiratorias en personas sensibles. Se recomienda reducir actividad física intensa si hay molestias.` :
                            (no2 > 0.1 && no2 <= 0.2) ?
                                `Dióxido de nitrógeno: Nivel malo (0.101 - 0.2 ppm). Puede generar tos, irritación respiratoria, afecta especialmente a personas con asma o enfermedades pulmonares. Limitar actividades al aire libre. Grupos vulnerables deben permanecer en interiores.` :
                                (no2 > 0.2 && no2 <= 0.5) ?
                                    `Dióxido de nitrógeno: Nivel muy malo (0.201 - 0.5 ppm). Riesgo elevado de inflamación de vías respiratorias, agravamiento de enfermedades pulmonares y síntomas asmáticos severos. Evitar exposición prolongada. Permanecer en interiores y usar filtros de aire.` :
                                    (no2 > 0.5) ?
                                        `Dióxido de nitrógeno: Nivel peligroso (>0.5 ppm). Exposición muy peligrosa, posible daño pulmonar severo con exposición prolongada. Evitar completamente el área afectada, usar protección respiratoria y buscar atención médica si hay síntomas graves.` :
                                        `Definición no encontrada`;

                alertas?.DioNitrogeno?.[nivelAlertaDioNitrogeno] && (alertas.DioNitrogeno[nivelAlertaDioNitrogeno].Message = messageNO2)
                // setDataDioNitrogeno(alertas['DioNitrogeno'][nivelAlertaDioNitrogeno]);
                qualityAirData['DioNitrogeno'] = {
                    data: no2,
                    MetricsData: alertas["DioNitrogeno"][nivelAlertNubosidad]
                }
                json_data_return['Quality-Air-Components'] = qualityAirData;
                break;
            case "Ozono":

                const o3 = ((climateAlert.current.air_quality.o3) * 24.45 / 64.07) / 1000;

                const messageO3 =
                    (o3 >= 0 && o3 <= 0.03) ?
                        `Nivel bueno (0 - 0.03 ppm). el nivel es bajo y tolerable, permitiendo realizar actividades normales al aire libre y ventilar espacios sin restricciones.` :
                        (o3 > 0.03 && o3 <= 0.06) ?
                            `Nivel moderado (0.03 - 0.06 ppm). el ozono puede causar irritación leve, por lo que se recomienda reducir el ejercicio intenso, especialmente en personas sensibles o con afecciones respiratorias.` :
                            (o3 > 0.06 && o3 <= 0.07) ?
                                `Nivel malo (0.06 - 0.7 ppm). el ozono ya resulta dañino, se aconseja evitar actividades al aire libre, permanecer en interiores y mantener ventanas cerradas.` :
                                (o3 > 0.07 && o3 <= 0.10) ?
                                    `Nivel muy malo (0.07 - 0.10 ppm). el nivel de ozono es peligroso y se recomienda suspender completamente las actividades exteriores, permanecer bajo techo y estar atento a síntomas respiratorios.` :
                                    (o3 > 0.10) ?
                                        `Nivel extremadamente peligroso (>0.10 ppm). el ozono es muy peligroso, por lo que se debe evacuar el área, no permanecer en el lugar y eliminar cualquier fuente generadora de ozono.` :
                                        `Definición no encontrada`;
                const nivelAlertaDioOzono = getAlert(o3, typeAlert);
                alertas?.Ozono?.[nivelAlertaDioOzono] &&
                    (alertas.Ozono[nivelAlertaDioOzono].Message = messageO3);

                //setDataOzono(alertas['Ozono'][nivelAlertaDioOzono]);
                qualityAirData['DioNitrogeno'] = {
                    data: o3,
                    MetricsData: alertas["DioNitrogeno"][nivelAlertNubosidad]
                }
                json_data_return['Quality-Air-Components'] = qualityAirData;
                break;
            case "DioAzufre":

                const so2 = ((climateAlert.current.air_quality.so2) * 24.45 / 64.07) / 1000;

                const messageSO2 =
                    (so2 >= 0 && so2 <= 0.017) ?
                        `Dióxido de azufre: Nivel bueno (0 - 0.017 ppm). Calidad de aire segura, sin riesgos para la población general. No se requieren precauciones.` :
                        (so2 > 0.017 && so2 <= 0.075) ?
                            `Dióxido de azufre: Nivel moderado (0.017 - 0.075 ppm). Puede causar irritación leve de las vías respiratorias en personas sensibles (niños, ancianos, asmáticos). Evitar esfuerzos físicos intensos al aire libre si hay molestias.` :
                            (so2 > 0.075 && so2 <= 0.5) ?
                                `Dióxido de azufre: Nivel malo (0.076 - 0.5 ppm). Aumenta riesgo de tos, ardor nasal, dificultad para respirar, especialmente en población vulnerable. Reducir actividades al aire libre y permanecer en interiores cuando sea posible.` :
                                (so2 > 0.5 && so2 <= 5) ?
                                    `Dióxido de azufre: Nivel muy malo (0.5 - 5 ppm). Exposición potencialmente peligrosa: inflamación de vías respiratorias, broncoespasmo, irritación ocular severa. Evitar completamente la exposición prolongada. Permanecer en interiores con filtros de aire y cerrar ventanas.` :
                                    (so2 > 5) ?
                                        `Dióxido de azufre: Nivel extremadamente peligroso (>5 ppm). Riesgo severo de daño pulmonar agudo y edema pulmonar. Evacuar la zona inmediatamente, usar protección respiratoria autónoma y activar protocolos de emergencia.` :
                                        `Definición no encontrada`;
                const nivelAlertaDioAzufre = getAlert(so2, typeAlert);
                alertas?.DioAzufre?.[nivelAlertaDioAzufre] && (alertas['DioAzufre'][nivelAlertaDioAzufre].Message = messageSO2)
                //setDataDioAzufre(alertas['DioAzufre'][nivelAlertaDioAzufre]);
                qualityAirData['DioAzufre'] = {
                    data: so2,
                    MetricsData: alertas["DioAzufre"][nivelAlertNubosidad]
                }
                json_data_return['Quality-Air-Components'] = qualityAirData;
                break;
            case "PM2_5":

                //const pm2_5 = ((climateAlert.current.air_quality.pm2_5) * 24.45 / 64.07) / 1000;
                const pm2_5 = ((climateAlert.current.air_quality.pm2_5));

                 messagepm2_5 =
                    (pm2_5 >= 0 && pm2_5 <= 12) ?
                        `(0 - 12 µg/m³). El nivel de Materia Particulada es baja , la calidad del aire es buena y no representa riesgo, permitiendo actividades normales al aire libre y ventilación habitual.` :
                        (pm2_5 > 12 && pm2_5 <= 35.4) ?
                            `(12.1 - 35.4 µg/m³). El nivel de Materia Particulada es Moderado, las personas sensibles pueden experimentar molestias leves, por lo que se recomienda reducir el ejercicio intenso en exteriores.` :
                            (pm2_5 > 35.4 && pm2_5 <= 55.4) ?
                                `(35.5 -55.4 µg/m³). El nivel de Materia Particulada es Alto, la calidad del aire es dañina para grupos sensibles, se aconseja limitar actividades al aire libre, especialmente en niños, adultos mayores y personas con enfermedades respiratorias.` :
                                (pm2_5 > 55.5 && pm2_5 <= 150.4) ?
                                    `(55.4 - 150.4 µg/m³). El nivel de Materia Particulada es muy alto, la calidad del aire es dañina  para la población general, se recomienda permanecer en interiores, evitar ejercicio al aire libre y mantener ventanas cerradas` :
                                    (pm2_5 > 150.4) ?
                                        `(>150.4 µg/m³).El nivel de Materia Particulada es Extremo, la calidad del aire es muy dañina, por lo que se debe evitar salir, usar purificadores de aire si están disponibles y prestar atención a síntomas respiratorios.` :
                                        `Definición no encontrada`;
                const nivelAlertaPM2_5 = getAlert(pm2_5, typeAlert);
                alertas?.PM2_5?.[nivelAlertaPM2_5] &&
                    (alertas.PM2_5[nivelAlertaPM2_5].Message = messagepm2_5);

                //setDataPM2_5(alertas['PM2_5'][nivelAlertaPM2_5]);
                qualityAirData['PM2_5'] = {
                    data: pm2_5,
                    MetricsData: alertas["PM2_5"][nivelAlertNubosidad]
                }
                json_data_return['Quality-Air-Components'] = qualityAirData;
                break;
            case "PM10":

                //const pm2_5 = ((climateAlert.current.air_quality.pm2_5) * 24.45 / 64.07) / 1000;
                const pm10 = ((climateAlert.current.air_quality.pm10));

                messagepm10 =
                    (pm10 >= 0 && pm10 <= 54) ?
                        `(0 - 54 µg/m³). El nivel de partículas inhalables (PM10) es bajo. La calidad del aire es buena y no representa un riesgo para la salud, permitiendo actividades normales al aire libre y ventilación habitual.` :
                        (pm10 > 54 && pm10 <= 154) ?
                            `(55 - 154 µg/m³). El nivel de partículas inhalables (PM10) es moderado. Personas sensibles pueden experimentar irritación leve en ojos, nariz o garganta, por lo que se recomienda reducir el ejercicio intenso en exteriores.` :
                            (pm10 > 154 && pm10 <= 254) ?
                                `(155 - 254 µg/m³). El nivel de partículas inhalables (PM10) es alto. La calidad del aire es dañina para grupos sensibles; se aconseja limitar actividades al aire libre, especialmente en niños, adultos mayores y personas con enfermedades respiratorias.` :
                                (pm10 > 254 && pm10 <= 354) ?
                                    `(255 - 354 µg/m³). El nivel de partículas inhalables (PM10) es muy alto. La calidad del aire es dañina para la población general; se recomienda permanecer en interiores, evitar ejercicio al aire libre y mantener ventanas cerradas.` :
                                    (pm10 >= 355) ?
                                        `(≥ 355 µg/m³). El nivel de partículas inhalables (PM10) es extremo. La calidad del aire es muy dañina; se debe evitar salir, usar purificadores de aire si están disponibles y prestar atención a síntomas respiratorios.` :
                                        `Definición no encontrada`;

                const nivelAlertaPM10 = getAlert(pm10, typeAlert);
                alertas?.PM10?.[nivelAlertaPM10] &&
                    (alertas.PM10[nivelAlertaPM10].Message = messagepm10);

                //setDataPM10(alertas['PM10'][nivelAlertaPM10]);
                qualityAirData['PM10'] = {
                    data: pm10,
                    MetricsData: alertas["PM10"][nivelAlertNubosidad]
                }
                json_data_return['Quality-Air-Components'] = qualityAirData;
                break;
            default: return { "Error": true, "Mensaje": "Valor no especificado" + typeAlert }
        }

        return json_data_return
    } catch (error) {
        return String(error);
    }


}
module.exports = Engine;
