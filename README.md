### deploy

1. create a new account on [railway.app](https://railway.app)
2. go to railway's dashboard (https://railway.app/dashboard) and create a new project
3. select "deploy from github repo" and paste the current github repo's url over there (i.e https://github.com/mickiestorm/chess-mates-mint-site-backend)
4. add the environment variables as mentioned in [.env.example](https://github.com/candypay/chess-champs-api/blob/main/.env.example) file. you'll need to add in `DATABASE_URL`, `WEBHOOK_URL` and `PAYER_SECRET_KEY` variables by your own. railway.app's documentation regarding adding environment variables -- https://docs.railway.app/develop/variables
5. create a new mongodb database by following this tutorial -- https://www.mongodb.com/basics/create-database
6. create a webhook for the channel where the bot would alert regarding the cron job status -- https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
7. add in the payer's secret key
