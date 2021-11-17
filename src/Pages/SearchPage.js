import React,
{ useState, useEffect } from 'react';
import Navigation from '../Components/Navigation';
import Search from '../Components/Search';
// eslint-disable-next-line no-unused-vars
const filterRestaurant = (posts, query) => {
  if (!query) {
    return posts;
  }
  return posts.filter((post) => {
    const postName = post.name.toLowerCase();
    return postName.includes(query);
  });
};

const posts = [
  { id: '1', name: ' Pizza Restaurant' },
  { id: '2', name: ' Burger Restaurant' },
  { id: '3', name: ' Ice Cream Restaurant' },
  { id: '4', name: ' Sushi Restaurant' },
  { id: '5', name: ' Poke Restaurant' },
];
function SearchPage() {
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
  const filteredRestaurant = filterRestaurant(posts, query);
  const [searchQuery, setSearchQuery] = useState(query || '');

  async function getRestaurantData() {
    await fetch('/getRestaurantData')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      }).catch((error) => console.log(error));
  }

  useEffect(() => {
    getRestaurantData();
  }, []);

  return (
    <>
      <Navigation />
      <div>This is the search page</div>
      <div>
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ul>
          {filteredRestaurant.map((post) => (
            <li key={post.key}>{post.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SearchPage;
