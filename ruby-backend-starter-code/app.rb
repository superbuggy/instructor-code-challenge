require 'sinatra'
require 'sinatra/reloader'
require 'json'

get '/' do
  File.open('views/index.html')
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

get '/favorites/:name/:oid' do
  unless params[:name] && params[:oid] then
    return 'Invalid Request'
  end
  loaded_json_file = JSON.parse(File.read('data.json'))
  movie = { name: params[:name], oid: params[:oid] }
  loaded_json_file << movie
  File.write('data.json', JSON.pretty_generate(loaded_json_file) )
  redirect to('/')
end
