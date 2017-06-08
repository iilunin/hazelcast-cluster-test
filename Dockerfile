FROM node:alpine
ENV WORK_DIR=/usr/src/app/
RUN mkdir -p ${WORK_DIR} \
  && cd ${WORK_DIR}
WORKDIR ${WORK_DIR}
COPY Node-HZ ${WORK_DIR}
RUN npm install

CMD ["node", "bin/www"]
