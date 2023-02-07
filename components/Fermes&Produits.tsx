import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Card from "./Card";

import "firebase/firestore";

const FermesProduits = () => {
  const [fermes, setFermes] = useState<any>([]);
  const [fermes2, setFermes2] = useState<any>([]);
  const [selectedFarm, setSelectedFarm] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [myLat, setMyLat] = useState<number>();
  const [myLon, setMyLon] = useState<number>();
  const [cityLat, setCityLat] = useState("");
  const [cityLon, setCityLon] = useState("");
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState(false)


  const getInfos = async (data: any) => {
    if (isOpen && selectedFarm === data) {
      setIsOpen(false);
      setLat("")
      setLon("")
    }
    if (isOpen && selectedFarm !== data) {
      setSelectedFarm(data);
      setLat(data.location._lat)
      setLon(data.location._long)
    }
    if (!isOpen) {
      setIsOpen(true);
      setSelectedFarm(data);
      setLat(data.location._lat)
      setLon(data.location._long)

    }

  };

  
  function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    const data = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    return data;
  }

  const getFermes = async () => {
    const colRef = collection(db, "fermes");
    const colRef2 = collection(db, "produits");
    const snapshots = await getDocs(colRef);
    const snapshots2 = await getDocs(colRef2);

    const docs = snapshots.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      data.distance = distance(cityLat, cityLon, data.location._lat, data.location._long)

      return data;
    });
    setFermes(docs);
    const docs2 = snapshots2.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      data.distance = distance(cityLat, cityLon, data.location._lat, data.location._long)


      setFermes((current: any) => [...current, data]);
      fermes.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name))
      return data;
    });

  };

  useEffect(() => {
    getFermes();
    setFermes2(fermes)

    navigator.geolocation.getCurrentPosition(function(position) {
      setMyLat(position.coords.latitude);
      setMyLon(position.coords.longitude);
    })


  }, [cityLat, cityLon]);

  const handleChange = (e: any) => {
    setCityLat(e.target.value.split(",")[0])
    setCityLon(e.target.value.split(",")[1])
    setIsOpen(false);
    setLat("")
    setLon("")
  }
  const stringFormat = (text: string): string => text.toLowerCase().replace(/\s+/g, '');

  const handleChangeSearch = (e: any) => {
    setSearch(e.target.value);
    setFermes2(fermes.filter((item: any) => stringFormat(item.name).includes(stringFormat(e.target.value))));
  };


  return (
    <div className="containerDiv">
      <div className="fermeproductDiv">
      {/* <div>Fermes & Produits</div> */}

      <form style={{ marginBottom: "10px"}}>
      <label>Choisissez votre ville : 
      <select onChange={handleChange}>
  <option value={["", ""]}></option>
  {myLat && myLon ? (
  <option value={[`${myLat},${myLon}`]}>My Position</option>) : 
  null
}
  <option value={["45.899247", "6.129384"]}>Annecy</option>
  <option value={["45.696", "-0.328744"]}>Cognac</option>
  <option value={["45.764043", "4.835659"]}>Lyon</option>
  <option value={["48.866667","2.333333"]}>Paris</option>
</select>      </label>
    </form>
    { cityLat  && cityLon ? 
    <>
    <label>Recherche: </label>
    <input type="text" onChange={handleChangeSearch} style={{ marginBottom: "10px"}} className="searchInput"/> 
    </>
    : null }
      <br />
      { cityLat  && cityLon ?
      <div className="itemContainer">
      { search ?
        (fermes2.sort((a: { distance: any; }, b: { distance: any; }) => a.distance - b.distance).map((ferme: any) => (
          <div className="itemDiv" key={ferme.id} onClick={() => getInfos(ferme) }>
          {ferme.name} 
          {ferme.contact === undefined ? <p className="pProduct">PRODUIT</p> : <p className="pFarm">FERME</p>}
          {ferme.distance && ferme.distance < 1 ? 
      <p className="pDistance">{ferme.distance.toString().split('.')[1].slice(0,3)} m</p> : 
      <p className="pDistance">{ferme.distance?.toFixed(2)} km</p>
    } 
        </div>
      ))) : (fermes.sort((a: { distance: any; }, b: { distance: any; }) => a.distance - b.distance).map((ferme: any) => (
        <div className="itemDiv" key={ferme.id} onClick={() => getInfos(ferme) }>
        {ferme.name} 
        {ferme.contact === undefined ? <p className="pProduct">PRODUIT</p> : <p className="pFarm">FERME</p>}
        {ferme.distance && ferme.distance < 1 ? 
    <p className="pDistance">{ferme.distance.toString().split('.')[1].slice(0,3)} m</p> : 
    <p className="pDistance">{ferme.distance?.toFixed(2)} km</p>
  } 
      </div>
    ))

      )}
      </div>
      : <p className="pDistance">Selectionnez une ville pour afficher les Fermes&Produits</p>
    }
    </div>
      <div className="mapsDiv">
      <iframe src={`https://maps.google.com/maps?q=${lat},${lon}&hl=es;&output=embed`} height="400px" width="400px"></iframe>

      {isOpen && selectedFarm ? <Card data={selectedFarm} /> : null}
      </div>
          </div>
  );
};

export default FermesProduits;

