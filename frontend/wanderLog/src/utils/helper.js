export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getInitials = (name) => {
  if(!name) return "";
  const words = name.split(" ");
  let initials = "";

  for(let i = 0; i < Math.min(words.length, 2); i++){
    initials += words[i][0];
  }

  return initials.toUpperCase();
}

export const getEmptyCardMessage = (filterType) => {
  switch(filterType){
    case 'search': 
      return `Oops! No stories found matching your search`;
    case 'date':
      return `No stories found in the given date range`;
    default:
      return `Start creating your first Log! Click the 'Add' button to jot down your thoughts, ideas, and memories. Let's get started!`
  }
}