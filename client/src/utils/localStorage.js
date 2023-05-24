export const getMySavedBookIds = () => {
  const mySavedBookIds = localStorage.getItem('my_saved_books')
    ? JSON.parse(localStorage.getItem('my_saved_books'))
    : [];

  return mySavedBookIds;
};

export const saveMyBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('my_saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('my_saved_books');
  }
};

export const removeMyBookId = (bookId) => {
  const mySavedBookIds = localStorage.getItem('my_saved_books')
    ? JSON.parse(localStorage.getItem('my_saved_books'))
    : null;

  if (!mySavedBookIds) {
    return false;
  }

  const updatedSavedBookIds = mySavedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('my_saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
