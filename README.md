# interview_assignment
This interview assignment serves to show full stack capabilities, using a python backend with a rendering framework of your choice for the frontend. This assignment has 3 markable components. 

• Database Interaction.
• REST API Development.
• Front End Development.

# Explanation

I did the backend part using aiohttp Python library, the backend contains the following endpoints:

* `/assets`
* `/liabilities`
* `/search`
* `/get_record`
* `/add_asset`
* `/add_liability`
* `/update_record`
* `/delete`

On the other hand, the frontend uses Next.js and Recharts.js for the graph. Contains the following endpoints:

* `/`
* `/add_record`
* `/update_record`
* `/view_asset`


# Run frontend

`$ cd interview_frontend`\

`$ npm install`\

`yarn dev`\

# Run backend

`$ pip install -r requirements.txt`\

`$ cd interview_backend`\

`$ cd aiohttp_backend`\

`$ python main.py`\


To see the application visit localhost:3000
