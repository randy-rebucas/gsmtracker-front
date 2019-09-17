// check for free subscription
// Always attach `populate()` to `find()` calls
MySchema.pre('find', function() {
  this.populate('user');
});

// if only free subscription
// Always `populate()` after `find()` calls. Useful if you want to selectively populate
// based on the docs found.
MySchema.post('find', async function(docs) {
  for (let doc of docs) {
    if (doc.isPublic) {
      await doc.populate('user').execPopulate();
    }
  }
});

// save new counts
// `populate()` after saving. Useful for sending populated data back to the client in an
// update API endpoint
MySchema.post('save', function(doc, next) {
  doc.populate('user').execPopulate().then(function() {
    next();
  });
});
