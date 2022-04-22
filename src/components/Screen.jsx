import React, {useRef, useState, useEffect, useCallback} from 'react';

import axios from 'axios';
import PokeCard from './PokeCard';


const Screen = () => {
  const [nextUrl, setNextUrl] = useState(null);
  const [pokemon, setPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const observer = useRef();
  const lastElementRef = useCallback((node) => {
    if(isLoading) return;
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && nextUrl){
        searchPokedex(nextUrl)
      }
    });
    if(node) observer.current.observe(node);
    
  }, [isLoading, nextUrl, pokemon]);

  const fetchPokemonDetail = async url => {
    const response = await axios.get(url);
    const {name, id, types, sprites, height, weight,base_experience} = response.data;
    return {id, name, type: types[0].type.name, img: sprites.front_default, height, weight,base_experience}
  }

  const searchPokedex = useCallback(async url => {
    setIsLoading(true);
    try{
      const response = await axios.get(url);
      const results = response.data.results;
      const {next} = response.data;
      if(next) setNextUrl(next);
      const detailRequests = results.map(async p => await fetchPokemonDetail(p.url))

      await Promise.all(detailRequests).then(detailResults => {
        setPokemon([...pokemon, ...detailResults]);
      })


    }catch(e){
      console.error(e)
    } finally{
      setIsLoading(false)
    }
  }, [nextUrl, pokemon])
  
  useEffect(() => {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    searchPokedex(url)
  }, []);

  const renderPokemon = () => pokemon.map((p, i) => {
    return i === pokemon.length -1 
    ? <div key={p.id} ref={lastElementRef}><PokeCard pokemon={p} /></div> 
    : <div key={p.id}><PokeCard pokemon={p} /></div>
});

  return (
    <section id="screen">
      <div className='pokedex' id="pokedex">{renderPokemon()}</div>
      {<h4>Loading....</h4>}
    </section>
  );
};

export default Screen;