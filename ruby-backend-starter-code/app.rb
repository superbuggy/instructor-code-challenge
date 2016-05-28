require 'sinatra'

get '/' do
  File.open('views/index.html')
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

get '/favorites/:name/:oid' do
  file = JSON.parse(File.read('data.json'))
  unless params[:name] && params[:oid] then
    return 'Invalid Request'
  end
  movie = { name: params[:name], oid: params[:oid] }
  file << movie
  File.write('data.json',JSON.pretty_generate(file))
  movie.to_json
end
