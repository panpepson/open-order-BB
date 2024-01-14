//  
//  skrypt wejscia na pozycje LONG bez klikania na gieldzie ByBit
//  jeśli staniesz się milionerem nie zapomnij kto Ci ten skrypt podarował :)  
//  kontakt https://trochymiak.net  
//  https://www.bybit.com/invite?ref=G8NARR 


// ATTENTION - you use the script at your own risk, if you do not understand what is happening below, do not run it.

// UWAGA - używasz tego skryptu na własną odpowiedzzialność, ie rozumiesz co się dziej niżej nie uruchamiaj go - Zachowaj Ostrożność



const { RestClientV5 } = require('bybit-api');
    require('dotenv').config(); // Wczytanie pliku .env z API kluczem 

async function main() {
 const client = new RestClientV5({
        testnet: true,                   // jeśli chcemy użyć MAINET zamieniamy na -> false
        key: process.env.TKEY,          //  tak samo tu T zamieni na M
        secret: process.env.TSECRET,   //  tzn MSECRET  
    });
 try {
       const response = await client.getOrderbook({
            category: 'linear',
            symbol: 'MATICUSDT',   // para
        });

 const cenaPoczatkowa = response.result.a[0][0]; // API pobiera aktualna cene
        let cenaP = Number(cenaPoczatkowa);
            cenaP.toFixed(2)     // ucina cyfry pozostawia tylko dwie ostatnie po kropce tzn 12.12
        let wzrostProcentowy = 0.9;  //  ile procenty

 function zwiekszCeneOWzrost(cenaP, wzrostP) {
      let wzrost = cenaP * (wzrostP / 100 * wzrostP );  // wylicza procent 
        wzrost = wzrost.toFixed(2);
//      console.log('W: ' + wzrost);    // dla sprawdzenia czy wszytko dział OK
      const cenaPoZ = cenaP + (wzrost * 2);
      return cenaPoZ.toFixed(2);
    }

 let cenaPoZ = zwiekszCeneOWzrost(cenaP, wzrostProcentowy);  // samo się tlumaczy 
      console.log('P: ' + cenaP);    // cena wejscia w pozycje 
      console.log('T: ' + cenaPoZ); // TakeProfit 
        const orderResponse = await client.submitOrder({   // dane przesylana do API 
            category: 'linear',
            symbol: 'MATICUSDT',
            side: 'Buy',
            positionIdx: 0,
            orderType: 'Limit',
            qty: '102',    // zmienna wyliczana na podstawie dziwgni + ile masz w portfelu - najlepiej ustawić ręcznie, metodą prób i błędów 
            price: `${cenaP}`,
            timeInForce: 'GTC',
            takeProfit: `${cenaPoZ}`,
            isLeverage: '0'
        });
        console.log(orderResponse);
    } catch (error) {
        console.error(error);
  }
}
main();


