# Edge Functions

The supabase functions are deployed to the edge functions and so can be accessed using postman.

To run the edge functions locally you will need to have node and deno installed.
Then run the following commands: 

```
npm install
deno install
npx supabase start
```

Create the local database using the migrations files: 
`npx supabase db reset`

Then serve the edge functions:
`npx Supabase functions serve`

# Testing

When Supabase is setup as above, you can run the tests with this command: 
`deno test --allow-all supabase/functions/tests/ --no-check`