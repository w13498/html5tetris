import cgi
import datetime
import urllib
import wsgiref.handlers

import random
import json
import datetime

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

        topScoreObjects = []
        curRank = 1
        for curScore in allScores:
            date = curScore.date
            topScoreObjects.append({
                    'name': curScore.name,
                    'score': curScore.score,
                    'date': datetime.date(date.year, date.month, date.day).isoformat()
                    })
        
        self.response.out.write(json.dumps({
                    'userScore': myScore.score,
                    'tempRef': myScore.tempRef,
                    'topScores': topScoreObjects
                    }) + '\n');


class HSPostScoreHandler(webapp.RequestHandler):
    def post(self):
        # TODO: obfusticate score input
        score = int(self.request.get('s'))
        tempRef = int(random.random() * 100000000)
        record = Score(score=score,
                       name=(self.request.get('name') or 'unnamed'),
                       tempRef=tempRef)
        
        record.put()
        
        self.response.out.write(str(tempRef) + '\n')

class HSApplyNameHandler(webapp.RequestHandler):
    def post(self):
        tempRef = self.request.get('tempRef')
        name = self.request.get('name')
        
        scoreQ = db.GqlQuery("SELECT * FROM Score WHERE tempRef = %s" % tempRef)
        score = scoreQ[0]
        score.name = name
        score.tempRef = 0
        
        score.put()

application = webapp.WSGIApplication([
        ('/score/full', HSFullTableHandler),
        ('/score/post', HSPostScoreHandler),
        ('/score/apply', HSApplyNameHandler),
        ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == '__main__':
    main()

