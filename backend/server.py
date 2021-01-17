#! /usr/bin/env python3

import asyncio
import websockets
import json
import random


class Server:
    """
    Server class that handle all the scenarios
    """
    config = None
    symbols = None
    elements_per_update = None
    update_frequency_milliseconds = None
    min_price = 0
    max_price = 100000

    def __init__(self, config_file):
        """
        Constructor that initialises the configuration of the server
        :param config_file:
        """
        with open(config_file, 'r') as file:
            self.config = json.load(file)
            self.set_config(self.config)

    async def handle_live(self, websocket):
        """
        handler for websocket in /live path, uses the generate_payload method and dumps it as json then it sleeps

        :param websocket:
        :return:
        """
        while True:
            payload = self.generate_payload()
            await websocket.send(json.dumps(payload))
            await asyncio.sleep(self.update_frequency_milliseconds / 1000)

    def generate_payload(self):
        """
        Creates the list of elements that are going to be returned as payload
        :return:
        """
        payload = []
        for i in range(self.elements_per_update):
            payload.append({
                "symbol": self.symbols[i % len(self.symbols)],
                "price": random.randint(self.min_price, self.max_price)
            })
        return payload

    async def handle_client(self, websocket, path):
        print(f"< {path}")
        if path == "/live":
            await self.handle_live(websocket)
        elif path == "/set-config":
            config = await websocket.recv()
            self.set_config(json.loads(config))
        elif path == "/get-config":
            await websocket.send(json.dumps(self.config))
        else:
            await websocket.send("error")
        await websocket.close()

    def start(self):
        asyncio.get_event_loop().run_until_complete(websockets.serve(self.handle_client, "localhost", 8765))
        asyncio.get_event_loop().run_forever()

    def set_config(self, config):
        """
        set all the configuration for the server
        :param config:
        :return:
        """
        if 'symbols' in config:
            self.symbols = self.config['symbols'] = config['symbols']
        if 'update_frequency_milliseconds' in config:
            self.update_frequency_milliseconds = self.config['update_frequency_milliseconds'] = int(
                config['update_frequency_milliseconds']
            )
        if 'elements_per_update' in config:
            self.elements_per_update = self.config['elements_per_update'] = int(config['elements_per_update'])


if __name__ == '__main__':
    server = Server('./config.json')
    server.start()
