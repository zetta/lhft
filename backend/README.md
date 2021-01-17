Server
======

The server needs to support configuration of the following style:

```json
{
  "symbols": [
    "AAAA",
    "BBBB",
    "CCCC",
    "DDDD"
  ],
  "update_frequency_milliseconds": 300,
  "elements_per_update": 50
}
```
The server should output the number of elements at a frequency configured for symbols.

Example elements update:

```json
[
  {
    "symbol": "AAAA",
    "price": 3003
  },
  {
    "symbol": "BBBB",
    "price": 43124
  }
]
```
The price should be randomly generated.

## How to run
```sh
pip install -r requirements.txt 
./server.py
```
open [localhost:3000](http://localhost:3000) if doesn't launch automatically
