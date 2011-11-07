import cgi
import datetime
import urllib
import wsgiref.handlers

import random

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class Score(db.Model):
    name=db.StringProperty()
    score=db.IntegerProperty()
    date=db.DateTimeProperty(auto_now_add=True)
    tempRef=db.IntegerProperty()

class HSFullTableHandler(webapp.RequestHandler):
    def get(self):
        allScoresQ = db.GqlQuery("SELECT * FROM Score " +
                                 "ORDER BY score DESC")
        allScores = allScoresQ.fetch(100);

        myScoreQ = db.GqlQuery("SELECT * FROM Score " + 
                               "WHERE tempRef = %s" % (self.request.get('tempRef')))
        myScore = myScoreQ[0]
        
        self.response.out.write('<html><body>')
        self.response.out.write('Your score: %s<br/><br/>' % (str(myScore.score)))
        
        self.response.out.write('Top Scores:<br/>');
        for curScore in allScores:
            self.response.out.write('%s : %s<br/>' % (str(curScore.score), str(curScore.tempRef)))
        
        self.response.out.write('</body></html>\n');


class HSPostScoreHandler(webapp.RequestHandler):
    def post(self):
        # TODO: obfusticate score input
        score = int(self.request.get('s'))
        tempRef = int(random.random() * 100000000)
        record = Score(score=score,
                       name=self.request.get('name'),
                       tempRef=tempRef)
        
        record.put()
        
        self.response.out.write(str(tempRef))

application = webapp.WSGIApplication([
        ('/score/full', HSFullTableHandler),
        ('/score/post', HSPostScoreHandler),
        ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == '__main__':
    main()

