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
    date=db.StringProperty()
    tempRef=db.IntegerProperty()

class HSPostGameHandler(webapp.RequestHandler):
    def post(self):
        myScoreQ = db.GqlQuery("SELECT * FROM Score " + 
                               "WHERE tempRef = %s" % (self.request.get('tempRef')))
        myScore = myScoreQ[0]

        totalRankQ = db.GqlQuery("SELECT * FROM Score WHERE score > %s" % (myScore.score))
        dailyRankQ = db.GqlQuery("SELECT * FROM Score WHERE date = '%s' AND score > %s"
                                 % (myScore.date, myScore.score))
        
        totalRank = len(totalRankQ.fetch(100)) + 1
        dailyRank = len(dailyRankQ.fetch(1000)) + 1

        if totalRank > 100:
            totalRank = -1
        if dailyRank > 100:
            dailyRank = -1

        self.response.out.write(json.dumps({
                    'userScore': myScore.score,
                    'tempRef': myScore.tempRef,
                    'totalRank': totalRank,
                    'dailyRank': dailyRank
                    }) + '\n');


class HSReportScoreHandler(webapp.RequestHandler):
    def post(self):
        # TODO: obfusticate score input
        score = int(self.request.get('s'))
        tempRef = int(random.random() * 100000000)
        record = Score(score=score,
                       name=(self.request.get('name') or 'Unnamed'),
                       tempRef=tempRef,
                       date=datetime.date.today().isoformat())
        
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
        ('/score/postGame', HSPostGameHandler),
        ('/score/reportScore', HSReportScoreHandler),
        ('/score/apply', HSApplyNameHandler),
        ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == '__main__':
    main()

