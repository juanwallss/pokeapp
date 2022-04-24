import React from 'react'
const PokeCard = ({pokemon}) => {
  
  const {id, img, type, height, weight,base_experience} = pokemon;
  const name = pokemon.name.toUpperCase();
    console.log(pokemon)
  return (
      <div className='poke-grid'>
    <div className="poke-card">
      <figure><img className='pokeimg' src={img} alt={name} title={name} /></figure>
      <div>#{id}</div>
      <p><strong>{name}</strong></p>
      <p>Tipo {type}</p>
      <p>Altura: {height}</p>
      <p>Peso: {weight}</p>
      <p>Exp: {base_experience}</p>
    </div>
    </div>
  )
}

export default PokeCard