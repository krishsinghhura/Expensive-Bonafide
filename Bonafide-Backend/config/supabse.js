// At the top of your file
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://oajusfprlyigewbipkiv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hanVzZnBybHlpZ2V3Ymlwa2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MjYwMDMsImV4cCI6MjA2MjAwMjAwM30.JDf44xHsu99rUHz7_N_8WrTaoifwPXHmF5PDYQ4Wnlw");

module.exports=supabase;