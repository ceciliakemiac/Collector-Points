import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
    async index(req: Request, res: Response) {
        try {
            const { city, uf, items } = req.query;
            const parsedItems = String(items)
                .split(',')
                .map(item => Number(item.trim()));
            console.log(city, uf, parsedItems);
            const points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems)
                .where('city', String(city))
                .where('uf', String(uf))
                .distinct()
                .select('points.*');

            return res.status(200).json(points);
        } catch(error) {
            return res.status(400).json({message: error});
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const point = await knex('points').where('id', id).first();

            if(!point) {
                return res.status(400).json({message: 'Point not found!'});
            }
            
            const items = await knex('items')
                .join('point_items', 'items.id', 'point_items.item_id')
                .where('point_items.point_id', id)
                .select('items.title');

            return res.status(200).json({point, items});
        } catch(error) {
            return res.status(400).json({message: error});
        }
    }

    async create (req: Request, res: Response) {
        try {
            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                items
            } = req.body;
    
            const point = {
                image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            };
        
            const insertedIds = await knex('points').insert(point);
            const point_id = insertedIds[0];
    
            const pointItems = items.map((item_id: number) => {
                return {
                    item_id,
                    point_id
                };
            });
            await knex('point_items').insert(pointItems);

            return res.status(200).json({
                id: point_id,
                ...point
            })
        } catch(error) {
            return res.status(400).json({message: error});
        }
  
    }    
}

export default PointsController;
