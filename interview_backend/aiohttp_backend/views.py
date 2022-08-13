from utils import execute_query
from aiohttp import web, web_request
import datetime

cols = ['id', 'coin', 'amt', 'equity', 'price', 'balance_time']
cols_update = ['coin', 'amt', 'equity', 'price', 'balance_time']

async def index_assets(request: web_request.Request):
    results = execute_query('../../balances.db', 'SELECT * FROM assets;')
    results = [dict(zip(cols, result)) for result in results]
    for r in results:
        r['kind'] = 'asset'
    # return web.Response(text=str(results))
    return web.json_response(results)

async def index_liabilities(request: web_request.Request):
    results = execute_query('../../balances.db', 'SELECT * FROM liabilities;')
    results = [dict(zip(cols, result)) for result in results]
    for r in results:
        r['kind'] = 'liability'
    # return web.Response(text=str(results))
    return web.json_response(results)

async def get_record(request: web_request.Request):
    params = dict(request.query)
    kind = 'assets' if params['kind'] == 'asset' else 'liabilities'
    result = execute_query('../../balances.db', f'SELECT * FROM {kind} WHERE `id` = "{params["id"]}"')
    result = dict(zip(cols, result[0]))
    print(result)
    return web.json_response(result)

async def update_record(request: web_request.Request):
    params = dict(request.query)
    kind = 'assets' if params['kind'] == 'asset' else 'liabilities'
    del(params['kind'])
    id = params['id']
    params = ', '.join([f'{k}="{v}"' for k, v in params.items()])
    print(params)
    result = execute_query(
        '../../balances.db',
        f'''
            UPDATE {kind} SET {params} WHERE `id` = "{id}"
        '''
    )
    # result = dict(zip(cols, result[0]))
    print(result)
    return web.json_response(result)

async def search(request: web_request.Request):
    params = dict(request.query)
    if 'days' in params.keys():
        last_date = execute_query(
            '../../balances.db',
            f'''
                SELECT balance_time FROM assets ORDER BY balance_time DESC LIMIT 1;
            '''
        )[0]
        print(last_date)
        if params['days'] != str(0):
            last_date = datetime.datetime.strptime(last_date[0], '%Y-%m-%d %H:%M:%S.%f')
            days = datetime.timedelta(int(params['days']))
            before = last_date - days
            # Use date range
            before = datetime.datetime.strftime(before, '%Y-%m-%d')
            last_date = datetime.datetime.strftime(last_date, '%Y-%m-%d')
            print(before, last_date)
            results_assets = execute_query(
                '../../balances.db',
                f'''
                    SELECT * FROM assets WHERE `coin` = "{params["q"]}"
                    AND DATE(balance_time) BETWEEN '{before}' AND '{last_date}' ORDER BY balance_time ASC;
                '''
            )
            print(len(results_assets))
        else:
            results_assets = execute_query(
                '../../balances.db',
                f'''
                    SELECT * FROM assets WHERE `coin` = "{params["q"]}";
                '''
            )
            print(f'Days 0' + str(len(results_assets)))
        results = [dict(zip(cols, result)) for result in results_assets]
    else:
        results_assets = execute_query(
            '../../balances.db',
            f'''
                SELECT * FROM assets WHERE `coin` = "{params["q"]}";
            '''
        )
        results_liabilities = execute_query(
            '../../balances.db',
            f'''
                SELECT * FROM liabilities WHERE `coin` = "{params["q"]}"
                ;
            '''
        )
        results_assets = [dict(zip(cols, result)) for result in results_assets]
        results_liabilities = [dict(zip(cols, result)) for result in results_liabilities]
        for r in results_assets:
            r['kind'] = 'asset'
        for r in results_liabilities:
            r['kind'] = 'liability'
        results = results_assets + results_liabilities
        results = sorted(results, key=lambda r: r['balance_time'])
    return web.json_response(results)

async def add_asset(request: web_request.Request):
    params = dict(request.query)
    query_result = execute_query(
        '../../balances.db',
        f'''
        INSERT INTO assets
            (`coin`, `amt`, `equity`, `price`, `balance_time`)
        VALUES (
            "{params["coin"]}",
            "{params["amt"]}",
            "{params["equity"]}",
            "{params["price"]}",
            "{params["balance_time"]}"
        );'''
    )
    # return web.Response(text=str(query_result))
    return web.json_response(query_result)

async def add_liability(request: web_request.Request):
    params = dict(request.query)
    query_result = execute_query(
        '../../balances.db',
        f'''
        INSERT INTO liabilities
            (`coin`, `amt`, `equity`, `price`, `balance_time`)
        VALUES (
            "{params["coin"]}",
            "{params["amt"]}",
            "{params["equity"]}",
            "{params["price"]}",
            "{params["balance_time"]}"
        );'''
    )
    # return web.Response(text=str(query_result))
    return web.json_response(query_result)

async def delete_record(request: web_request.Request):
    params = dict(request.query)
    kind = 'assets' if params['kind'] == 'asset' else 'liabilities'
    query_result = execute_query(
        '../../balances.db',
        f'''
        DELETE FROM {kind} WHERE `id` = {params["id"]};
        '''
    )
    # return web.Response(text=str(query_result))
    return web.json_response(query_result)
