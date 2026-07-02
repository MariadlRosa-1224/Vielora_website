import {useState, useEffect, use} from "react";
import Achievement from "../Achievement/Achievement";
import styles from './AchievementList.module.scss'
import { useFetch } from "../useFetch/useFetch";

import { Loader } from '@mantine/core';



interface UrlResponse {
    results: Array<{name: string}>;
}

interface pokemonResponse {
    name: string;
    sprites: {
        front_default: string;
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
}


const AchievementList = () => {
    const [items, setItems] = useState<Array<{name: string, image: string, category: string}>>([]);

    const {data, isLoading, error} = useFetch<UrlResponse>("https://pokeapi.co/api/v2/pokemon");

    useEffect(() => {
        if (data && Array.isArray(data.results)) {
            data.results.forEach(async (item) => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.name}`);
                    const itemData: pokemonResponse = await response.json();
                    setItems(prevItems => [
                        ...prevItems,
                        {
                            name: itemData.name,
                            image: itemData.sprites.front_default,
                            category: itemData.types[0].type.name
                        }
                    ]);
                } catch (err) {
                    console.error(`Failed to fetch data for item ${item.name}:`, err);
                }
            });
        }
    }, [data]);

    if (isLoading) {
        return  <div><Loader color="violet" size="lg" type="bars" /></div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }




    return (
        <div className={styles.ItemList}>
            {items.map((item, index) => (
                <Achievement 
                    key={index} 
                    title={item.name} 
                    image={item.image} 
                    color="blue"
                    description={`This is the ${item.name} achievement.`}
                    state="Unlocked"
                />
            ))}
        </div>


    );

}

export default AchievementList;