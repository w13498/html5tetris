import cgi
import datetime
import urllib
import wsgiref.handlers

import random
import datetime

from django.utils import simplejson
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

        self.response.out.write(simplejson.dumps({
                    'userScore': myScore.score,
                    'tempRef': myScore.tempRef,
                    'totalRank': totalRank,
                    'dailyRank': dailyRank
                    }) + '\n');


class HSReportScoreHandler(webapp.RequestHandler):
    def post(self):
        # TODO: make a real anti-fake-score-abuse system
        score = int(self.request.get('gthbyu'))/17
        tempRef = int(random.random() * 100000000)
        # TODO: CGI clean name input
        record = Score(score=score,
                       name=cgi.escape(self.request.get('name') or 'Unnamed'),
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

class HSTablesHandler(webapp.RequestHandler):
    def post(self):
        # get both lists
        topScoreQ = db.GqlQuery("SELECT * FROM Score ORDER BY score DESC")
        topScores = topScoreQ.fetch(100)
        
        todayString = datetime.date.today().isoformat()
        dailyScoreQ = db.GqlQuery("SELECT * FROM Score WHERE date = '%s' ORDER By score DESC" % (todayString))
        dailyScores = dailyScoreQ.fetch(100)

        topScoreList = []
        dailyScoreList = []
        
        # remove the unneeded values from the lists
        for curScore in topScores:
            topScoreList.append({
                    'score': curScore.score,
                    'date': curScore.date,
                    'name': curScore.name
                    })
        for curScore in dailyScores:
            dailyScoreList.append({
                    'score': curScore.score,
                    'name': curScore.name
                    })
        self.response.out.write(simplejson.dumps({
                    'topScores': topScoreList,
                    'dailyScores': dailyScoreList
                    }));



application = webapp.WSGIApplication([
        ('/score/postGame', HSPostGameHandler),
        ('/score/reportScore', HSReportScoreHandler),
        ('/score/apply', HSApplyNameHandler),
        ('/score/tables', HSTablesHandler)
        ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == '__main__':
    main()

