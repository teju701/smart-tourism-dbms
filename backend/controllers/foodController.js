import pool from '../db/index.js'

export const getfoodplacesByCity = async(req,res)=>{
    const{city_id} = req.params;
    try{
        const result = await pool.query(`SELECT * FROM get_food_by_city($1)`,[city_id]);
        res.json(result.rows);

    }catch(error){
         console.error("Error fetching foodplaces:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const addFoodPlace = async(req,res)=>{
    const{city_id,restaurant,avg_cost,rating} = req.body;
    try{
        const result = await pool.query(
            `CALL add_new_foodplace($1,$2,$3,$4)`,[city_id,restaurant,avg_cost,rating]
        );
        res.json({message: "FoodPlace Added Successfully"});

    }catch(err){
        console.error("Error adding foodplace:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAvgFoodCostPerCity = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM avg_food_cost_per_city ORDER BY avg_food_cost ASC;");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching average food cost per city:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
