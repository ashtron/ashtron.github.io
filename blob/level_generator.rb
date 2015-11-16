level = []
100000.times do
  level.push(Array.new(26, 0))
end

r = 15
level[0][r] = 1

(1...level.length).step(2).each do |i|
  rand(2) === 0 ? r -= 3 : r += 3
  r += 6 if r < 0
  r -= 6 if r > 9
  level[i][r] = 1
end

puts level.inspect
