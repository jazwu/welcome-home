export const getRooms = async () => {
  try {
    const response = await fetch("/api/rooms");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getShelves = async (roomNum) => {
  try {
    const response = await fetch(`/api/rooms/${roomNum}/shelves`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
