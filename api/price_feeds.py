from ctc.protocols import chainlink_utils
from sanic import Sanic
from sanic.response import json
app = Sanic()

@app.route('/')
@app.route('/<path:path>')
async def index(request, path=""):
    feed = 'ETH_USD'
    feed_addr = await chainlink_utils.async_resolve_feed_address(feed)
    feed_data = await chainlink_utils.async_get_feed_data(feed_addr)
    return json({'hello': path, 'feeds': feed_data})