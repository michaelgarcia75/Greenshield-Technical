import React, { useState, useEffect } from "react";

const Card = ({ data }: any) => {
  const [checked, setChecked] = useState(false)
  const [search, setSearch] = useState('')

  const patchAlias = async (data: any, search: string) => {
    fetch(`https://firestore.googleapis.com/v1/projects/nextjs-greenshield/databases/(default)/documents/produits/${data.id}?currentDocument.exists=true&updateMask.fieldPaths=alias&alt=json`, {

  body: JSON.stringify({ fields: { alias : { stringValue : `${search}`}}}),
  method: "PATCH"
}
);
data.alias = search
setChecked(!checked)

}

const handleChangeSearch = (e: any) => {
  // to reset infinity scroll behaviour
  e.preventDefault();
  setSearch(e.target.value);
};

useEffect(() => {
setChecked(false)

}, [data]);



  return (
    <div className="cardDiv" style={data.contact && { background: "rgb(173, 216, 230, 0.8)"}}>
      <br />
      <p>{data.name}</p>
      {data.contact && (
      <div className="contactDiv">
        <p>Contact :</p>
      <p>Nom: {data.contact.nom}</p>
          <p>Prénom: {data.contact.prenom}</p>
          <p>Email: {data.contact.email}</p>
          <p>Tel: {data.contact.tel}</p>
          </div>
      )}
      {!data.contact && 
      <div>
      {!checked ? <p>{data.alias && "Alias: "}{data.alias}</p> : <div className="inputCardDiv"> <p>{data.alias && "Alias: "}</p>  <input type="text" onChange={handleChangeSearch} placeholder={data.alias} className="patchInput"/> </div>}
      {!checked ?
      <button onClick={() => setChecked(!checked)}>{data.alias ? "Change Alias" : "Add Alias"}</button>
    : <button onClick={() => patchAlias(data, search)}>Valider</button>}
      </div>
      }
      {data.distance && data.distance < 1 ? 
      <p className="pDistanceCard">Distance: {data.distance.toString().split('.')[1].slice(0,3)} m</p> : 
      <p className="pDistanceCard">Distance: {data.distance?.toFixed(2)} km</p>
    }
    </div>
  );
};

export default Card;
